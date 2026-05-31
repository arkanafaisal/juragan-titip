
D:\Arkana\project\JuraganTitip>git --no-pager log eb80b3455341dcf86f1370ddddea70d78cc91a77..HEAD --pretty=format:"%H %s"
316ca8a7910f3eb4d67a24ae1daae9dbd55a65c2 update(journey page): show user static location
5cbd453097426874535ce0556400df0aefa11df3 update(page header): hide notification & add full screen mode toggle
f7154c37122917299009870fda4bccb671da76ae refactor(journey page): journey service
2d72a6674a0389f11147b3f0ba155614b886d784 update(journey page): gps failed handler, distance calculation, priority grouping, leaflet openstreetmap, zoom & scroll map
2aa609f2a2f93382be40a9db02cd15789ce7c617 cleanup(TS): unused imports, type missmatch      
27f4ca421bfb58d1ea93823646fcfdb54dd3b51f feat(dashboard page): integrate dashboard service to get data
b8ff7d0bc61d060754859fb063d2088772982587 update(finance): reduce padding
582c15457aab7136a16bedccd137e22131bceeba feat(settings page): JSON backup & recovery      
b046a6040b42cee097cadd88fdb9ab9afe58243c update(action toolbar): fixed max height & overflow hidden
896a67732feb8495ac2ebce6fd847307068dd4f8 add(settings page): input validation
2d562e496e451354b7b3e0c165fcb14a2371192a add(settings page): reset settings data
01e8827a77df651cb693906600b2447a6d2e0f71 update(finance): reduce padding
78885b45c4f26a5bb6b198be06be2454b4c538e0 fix(journey): route level (fullscreen)
d6115f7ba861c2cb934ade2ce6d876cd45521a74 add(store settings): days overdue input & filter 
3a7f3b42a8487e3c425e18cb38e7e80abc66c78b add: react lazy load
c4bfc8971f6d2f5e98274c537e01c535fe61ca23 fix(product list): settings navigation query url 
03812c8d999c9a56d6c1cb05dadb1001ebc8f37e update(dashboard page): new UI
0803619cd0ebcf2d744be7abbcb3c9ae88399f1d add: store category settings
c5db78eec5311fc677a49d68f454b9acda8c5b89 add(store list): sortBy last visit
8cfaf257545804e39fad1167046a4f307bfed387 add: notification panel (UI)
ee43445b161022ed9b7bdea47b026820c51572f6 add(store card): last visit data
f24b51756859d7d949759e4d30985b5cdb7aca5a add(store detail): last visit data
cc8be35d866a3e0a6a1fff31fd9b9c7d7c237169 add(store schema): string lastVisitAt
8a02c190cbf41d5314bfb56a41f83e5e37e63fef update(action toolbar): close filter on select   
04e651ca149552b28b083f5c27719a49f9037e0d feat(settings page): query instruction
050e85fa03559e1a58984bddf0fb9f9421e46522 update: rename focus mode to journey
62e968b95a5bd0934e330e10468a038d3fc0ebac remove(settings page): header
3e53412f526ce1e80b897a90f50e37a7dc4e54e4 feat: delete all data setting
e7e7769e031c29bd3bf157b0ff9113567e61aad5 feat: custom product category setting
21f7dd440261edcbbe585c7b0902ab026cb48f7a add: focus-mode (UI)
aa4670335828315e9c5640ac7696d55ccbdb3479 add: product category setting (UI & service)     
17b6c836fb36b1d68cddcf3c6ccb802745661cc3 feat: low stock treshhold setting
1e19bc36b9d122487c49d4bded018803f55793e1 add: settings page (UI)
0dfeafc0f2f49193693f135d526702ac2cf5285e add: settings page (UI)
a8b7c6636aa41c95ca36fc3500fb8460ca556bb3 add(store detail): invoice detail
9879399c03e933823eaeb8d30c77fa38afde1bea add(invoice detail): added invoice note generator
672634c5744ec1afc0e5d8def24e4bab14e36a19 feat(finance): integrate finance api services
cbddff29ee87b250eedf4ab7b20e805a4441d2ac add(finance services): finance page api
913b103a5815ee35e5acbf67e00aff0f521ee38c remove(visit schema): documentNumber
d24c0f4cbb1f40b801e2b250f7ac82f4b2f82efa update(visit service): desc id sort
c3ad0b495a27e9cd3b7de9793e86051fbbd1b81c feat(visit step checkout): connect paid amount input value into visit create data
47b7f55a90f43e87012330e48bca00c002ff7679 add(step checkout): paid amount input (UI)       
3318c306222a4204382d5140b806bc0d0188981d update(type): remove visit totalBilled
d6fe1b63ab3d3c5f83718a425cfb39c4e40ab35a update(store detail): show store debt & assetValue
59ee61133ef3e394d1a27e0c19f13dc2b54c3dcd update(visit service): use db transaction & add store debt & assetValue
f86dc06432c57ced0acd1c35ba87eb01f0231ef9 update(type): rename previousReceivable to currentDebt
b74d211cda16533e5e4f32ef83b47cd53e88fc25 update(type): add assetValue property to store type
722b6201a129740593e91bd0159a449a9984ecec update(type): rename store totalReceivable to debt
37c2b22f93fe67c7493f8d10d45bae033c74616d update(store visit): container padding
0a21bd3c56ff7783914be1e632a6e2a53fb66b40 update(visit step restock): empty state text padding & align
1ace9c3fee494a852c80c409fedcf7c7075e10b1 update(visit step opname): remove disable & move error into toast
31f98fd970fdd9c4aca37ca301754527b6c24443 update(store-visit): remove restock item bill charge
65b090c53692927fe62bb9f0e932cc7a1a7c3f6f update(validation rules): phone & addess length
783390f4d96f27ab748726e3f54c32f87e847e28 update(store service): warning modal on duplicate store name & phone
6d4188e4e413f0e250e46b7978ae262c7906beb1 update(store type): optional phone property      
c28651685e96e28bb93d0bdfdb79752d62e4c40d update(store schema): remove unique constraint on name & phone
d2a4a6e8735a1bc262d847a6b0a9e9e39cef611a add: finance UI
7cea6d8591c2f83cfdc1ec335befe9c921a5ce48 update(input): autocomplete off on repetitive input
35285094f2449f85b0f03d6500ba1c30af3fce0c update(store form): sonner notification on gps error
a3956ced6a0fdd20fe4a3cfeb440f835d5ea1679 feat: profile menu input validation
5f60ce51d817565d1a7a30b2b54a53be57e18988 remove: auth guard & pages
243d48b07e645d0e975a9007b3197e2583a95306 feat: use profile service
7a5590726b96edbcfdcb09f99f701d553277d6c9 add: profile service
a0197978ca69d1183dba49e50b42bab607225ebb refactor(header, sidebar): use profile menu component
2a11423cf57bf6f12344363913271ae2f43526ba add: profile menu component
