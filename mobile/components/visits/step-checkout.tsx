import React, { useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { CheckCircle2, ArrowLeft, Loader2, DollarSign, Wallet } from 'lucide-react-native';
import { useFormContext, Controller } from 'react-hook-form';
import THEME from '../../constants/css';
import { Card } from '../ui/card';
import { VisitFormValues } from '../../schemas/visit.schema';

export interface BillingItem {
  id: string;
  name: string;
  type: 'sold' | 'restock';
  qty: number;
  price: number;
}

export interface StockItem {
  productId: number;
  productName: string;
  initialStock: number;
  sold: number;
  returned: number;
  remained: number;
  restock: number;
  total: number;
}

interface StepCheckoutProps {
  currentDebt: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onFinish: () => void;
  formatCurrency: (val: number) => string;
}

export function StepCheckout({
  currentDebt,
  isSubmitting,
  onPrev,
  onFinish,
  formatCurrency
}: StepCheckoutProps) {

  const { control, watch, setValue, formState: { errors } } = useFormContext<VisitFormValues>();
  
  const opnameItems = watch('opnameItems') || [];
  const restockItems = watch('restockItems') || [];

  const isVisitEmpty = opnameItems.length === 0 && restockItems.filter(i => i.quantity > 0).length === 0;

  const billingItems = useMemo(() => {
    const items: BillingItem[] = [];
    opnameItems.forEach(item => {
      if (item.sold > 0) {
        items.push({ id: `${item.productId}_sold`, name: item.productName, type: 'sold', qty: item.sold, price: item.wholesalePrice });
      }
    });
    return items;
  }, [opnameItems]);

  const displayStockItems = useMemo(() => {
    const map = new Map<number, StockItem>();
    
    opnameItems.forEach(item => {
      map.set(item.productId, { 
        productId: item.productId, 
        productName: item.productName, 
        initialStock: item.initialStock,
        sold: item.sold,
        returned: item.returned,
        remained: item.remained,
        restock: 0,
        total: item.remained
      });
    });
    
    restockItems.forEach(item => {
      if (item.quantity > 0) {
        const existing = map.get(item.productId);
        if (existing) {
          existing.restock = item.quantity;
          existing.total += item.quantity;
        } else {
          map.set(item.productId, { 
            productId: item.productId, 
            productName: item.productName, 
            initialStock: 0,
            sold: 0,
            returned: 0,
            remained: 0,
            restock: item.quantity,
            total: item.quantity
          });
        }
      }
    });
    
    return Array.from(map.values());
  }, [opnameItems, restockItems]);

  const subtotal = billingItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const totalBilled = currentDebt + subtotal;
  
  // Sinkronisasi subtotal ke dalam FormState agar bisa disubmit dengan benar
  useEffect(() => {
    setValue('checkout.subtotalLaku', subtotal);
  }, [subtotal, setValue]);

  const amountPaidVal = watch('checkout.amountPaid') || 0;
  const remainingDebt = Math.max(0, totalBilled - amountPaidVal);
  const change = Math.max(0, amountPaidVal - totalBilled);

  return (
    <View className="flex-1 flex-col pb-4">
      <View className="mb-4 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">Tagihan & Sisa Stok</Text>
        <Text className="text-body-sm text-text-secondary">Periksa kembali ringkasan sebelum menyimpan kunjungan.</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        
        {/* RINGKASAN TAGIHAN */}
        <Card className="flex-col !p-0 overflow-hidden mb-4">
          <View className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex-row items-center gap-2">
            <DollarSign size={18} color={THEME.colors.primary} />
            <Text className="font-bold text-text-primary text-body">Ringkas Tagihan</Text>
          </View>
          
          <View className="p-4 flex-col gap-2">
            {billingItems.map(item => (
              <View key={item.id} className="flex-row justify-between items-center">
                <Text className="text-text-secondary font-body-sm">{item.name} <Text className="font-bold">x{item.qty}</Text></Text>
                <Text className="font-mono text-text-primary">{formatCurrency(item.qty * item.price)}</Text>
              </View>
            ))}
            {billingItems.length === 0 && (
              <Text className="text-text-secondary text-center italic py-2">Tidak ada barang laku</Text>
            )}

            <View className="border-t border-dashed border-outline-variant my-2" />
            
            <View className="flex-row justify-between items-center">
              <Text className="text-text-secondary">Subtotal Laku</Text>
              <Text className="font-mono font-bold text-text-primary">{formatCurrency(subtotal)}</Text>
            </View>
            
            {currentDebt > 0 && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-error">Piutang Sebelumnya</Text>
                <Text className="font-mono font-bold text-error">+{formatCurrency(currentDebt)}</Text>
              </View>
            )}

            <View className="bg-primary/10 rounded-lg p-3 flex-row justify-between items-center mt-3">
              <Text className="font-bold text-primary">Total Tagihan</Text>
              <Text className="font-mono font-bold text-primary text-h3">{formatCurrency(totalBilled)}</Text>
            </View>
          </View>
        </Card>

        {/* PEMBAYARAN */}
        <Card className="flex-col !p-0 overflow-hidden mb-4">
          <View className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex-row items-center gap-2">
            <Wallet size={18} color={THEME.colors.success} />
            <Text className="font-bold text-text-primary text-body">Pembayaran</Text>
          </View>
          
          <View className="p-4 flex-col gap-4">
            <View>
              <Text className="text-caption text-text-secondary mb-1">Nominal Dibayar (Rp)</Text>
              <Controller
                control={control}
                name="checkout.amountPaid"
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    value={value ? String(value) : ''}
                    onChangeText={(val) => {
                      const cleaned = val.replace(/\D/g, '');
                      onChange(parseInt(cleaned) || 0);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-mono font-bold text-h3 text-text-primary"
                  />
                )}
              />
            </View>

            <View className="flex-row gap-2">
              {[20000, 50000, 100000].map(nom => (
                <TouchableOpacity 
                  key={nom}
                  onPress={() => setValue('checkout.amountPaid', nom, { shouldValidate: true })}
                  className="flex-1 bg-surface-variant border border-outline-variant py-2 rounded-lg items-center"
                >
                  <Text className="font-mono text-caption font-bold text-text-secondary">{nom / 1000}k</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                onPress={() => setValue('checkout.amountPaid', totalBilled, { shouldValidate: true })}
                className="flex-[1.5] bg-success/10 border border-success/30 py-2 rounded-lg items-center"
              >
                <Text className="font-mono text-caption font-bold text-success">Pas</Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-dashed border-outline-variant pt-3 mt-1">
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-text-secondary">Sisa Piutang Toko:</Text>
                <Text className="font-mono font-bold text-error">{formatCurrency(remainingDebt)}</Text>
              </View>
              {change > 0 && (
                <View className="flex-row justify-between items-center mt-1">
                  <Text className="font-bold text-text-secondary">Kembalian:</Text>
                  <Text className="font-mono font-bold text-success">{formatCurrency(change)}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* RINGKASAN STOK DITINGGALKAN */}
        <Card className="flex-col !p-0 overflow-hidden mb-24">
          <View className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
            <Text className="font-bold text-text-primary text-body">Stok Ditinggalkan</Text>
          </View>
          
          <View className="p-4 flex-col gap-3">
            {displayStockItems.map(item => (
              <View key={item.productId} className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-text-primary font-medium">{item.productName}</Text>
                  <Text className="text-caption text-text-secondary">
                    {item.initialStock > 0 && `Awal: ${item.initialStock}`} 
                    {item.restock > 0 && ` | + Baru: ${item.restock}`}
                  </Text>
                </View>
                <View className="bg-primary/10 px-2 py-1 rounded-md">
                  <Text className="font-bold text-primary">{item.total} pcs</Text>
                </View>
              </View>
            ))}
            {displayStockItems.length === 0 && (
              <Text className="text-text-secondary text-center italic py-2">Tidak ada stok yang ditinggalkan</Text>
            )}
          </View>
        </Card>

      </ScrollView>

      {/* FIXED FOOTER */}
      <View className="absolute bottom-0 inset-x-0 p-4 bg-background border-t border-outline-variant flex-row gap-3">
        <TouchableOpacity 
          onPress={onPrev}
          className="flex-1 bg-surface-container-low py-3.5 rounded-xl flex-row items-center justify-center gap-2 border border-outline-variant"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} color={THEME.colors['text-primary']} />
          <Text className="text-text-primary font-bold">Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onFinish}
          disabled={isSubmitting}
          className={`flex-[2] py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${isSubmitting ? 'bg-surface-variant' : 'bg-success'}`}
          activeOpacity={0.8}
        >
          {isSubmitting ? <Loader2 size={20} color={THEME.colors['on-primary']} className="animate-spin" /> : <CheckCircle2 size={20} color={THEME.colors['on-primary']} />}
          <Text className={`${isSubmitting ? 'text-text-secondary' : 'text-on-success'} font-bold`}>Selesaikan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
