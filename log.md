git --no-pager log ef1210ee6671c85943e3b49f8231665bbe231461..HEAD --pretty=format:"%H %s"
5c1fd2f3098b46c4c7d780c53b5d19010575e615 update(store detail): add back button, change edit delete button & history tabs UI style
d18313a20c6e3f2e38cd96a3fb2bbce94daf47b4 update(store detail): remove font bold & font black
6268ea0df8e8eeb1ddfbcb0c0d131542eacf1a28 update(action toolbar): sticky on scroll
abfcad55de0bc6999333a2654105e492cae30d7c fix(product getAll service): avoid full table scan on category filter
b2424add22205cab94c26e9fd7febeb0c148457d fix(visit create): cancel transaction on not found product
2e5baa33a34f32bff732703997f91df9d913aaea fix(backup & settings service): add inventory logs table
0fe0c0dde7633bcf6e737a745c3978347e8be925 fix: modals breakpoint
b8ac4dd3e2d4d49142ef0cede2bc71158b1954d0 remove: breakpoint classes
901759baa9332ddb89a21c9f873f4a12be55c305 update: lock app width layout into mobile only
def74662583de55527f776f1b7b334897af6c5a5 update: hardcoded classes to design tokens
a421c390e480123b47247d9999eaac1994460491 update(product detail & edit): consistent size classes
8fbb4af3a4ba921ac079d1e19e17135534acc203 fix(store & product card): prevent repeated localstorage hit & function declaration
25f023f4757483c509d843d2137dfddb03813fd0 fix: prevent recreate static code on rerender
8282cc8d1419a5ddbc42f9e64e97a93a8dd30475 refactor: reuse mobile bottom drawer
ccf46542d3e61213c987149e756ee8fee986dde1 fix: tailwind animate import
5c9f7af9d579a5f72acbb4e777814a5637a3051e delete unused file & packages
1513428492b6e24e90b4848852da0273a1219902 delete unused file (auth service)
4f33a8adf65325a66b3cfa18bb7103b953e3a11a update(product & store service): change search query from includes to startsWith
b8be54ba48530bf31d4fbd0030fd17ba0e2343f3 remove: as any typesafety gap
f816a0d0257d356318c05cf20444569615c1f674 fix(store service): first sorting on getAll
9356e6b0f3d148d1609bfc57f8db3b72efb2369d delete: unused ui components
ff1daeba4e0a60aacda10493c26c6115d132698b delete: unused files & router config
61bfa215e439cd4008bb9376ab76a5499191f798 update gitignore
358e32aabc011c2cd5313a86790799d4cbc77ac7 add test scripts
5b70d1363efd274780bf7fb6409b3e5650fab98b cleanup: unused file
97bc4b84db2bfc720278a920d9ba3bac6b570a22 cleanup: backend & docs folder


git --no-pager log 7294658fa2cc2e1841bd7480d6532823f28268d1..HEAD --pretty=format:"%H %s"
9251d070de79321ee5a1b0f269a0c940a2849b8c update(process return modal): change recycle theme from blue to green
e15d43dde5ec6339995c0b3fb646d521a4b6d9ef feat(process return modal): implement product service
f03384fd25d3fa36980d7a51b124fa99db033738 update(process return modal): styling
fdd4e06d5e0fd49bdac944be40abf2d2bc1f26f4 (add stock modal): implement product service     
598d8dc5efca64ddfff5f6bd31811f0f2af02bbe update(product detail page): fontsize
a56fe4442dfaafec105e761b43795d8d3f3e3bd1 fix(product detail): back navigate
1497039cc737937024a76a0da0cbbdbdd6495b7b update(product detail page): fontsize & fontfamily
c5fcc25620e3105c5d17ec63dd4b52800944a413 update(product edit page): styling
3edf804802d5df9748710532ef88b70b1611baa4 update(product detail): styling & wording        
2f1accb0a6f87fa43d553beb77e206fdd24a2059 update(edit stock modal): colors
a27a989825298b56bb42a008e3c02159258af883 update(edit stock modal): integrate product service
8b21456e5306e3b830f5e9f36714652a462f0e1b update(product & store service): default abjad a-z order
9243f290e44be594c58766ff094fbe56a35af768 update(product filter): stock level wording      
da716808832077e7a40995606875e94fcb418261 fix(step restock): update product returnedStock on finish
8067b411f26a633db0d83211b9b88dd5c6ec6c10 update(product-edit): remove dummy & integrate product service
8ff0865c888eb220be112e7795feaaa5766bd86b update(product-form-modal): fully for add product & change fields wording
37be8fc10f517b1591ca044881c2915a97cab527 update(validation): separate product validation  
380f108f6cbe5f78e245955df502d006c6e19ae0 update(product list): remove edit & delete btn & connect card into detail page
de5fe99835b1ba7a19c94d2953ac5da057f55fbb feat(product detail): implement product service  
fdb825f048173a12d765b820152e7c5b9d4d79fb update(edit product): separate page
094a202b13639a83dc6e6ea36c9459ee59f3ee5c refactor(product detail): modularization
2f1c3a9edbed9a09bdd4754322e2b784abe92914 update(visit service): hit inventory logs oncreate transaction
1a691b11fe9b74d75611b5f9fb7295de2a1a287d update(product detail): UI & features
2dd324b4abfa360a49544d243c8ca96458efc853 update(type models): add correction on InventoryActionType
5f262af7c3f63e04ad8bb84476dd41ce5013555e update(step checkout): hide amountPaid input & status info on 0 totalBilled
33efdfc60353e82a2550d990e1cbeba7dcec722c update(invoice detail): show send to my number on missing user phone number (guarded by toast)
2fde023e8e9f63fbb15356fd1fb20756e533f3df fix(journey page): empty store on overdue filter 
1feb5391ab1f49ef42b2bb2b83023fae05e6e8ec fix(product form): fallback retail price to 0    
35bcff4be17936ddb8a7fea84c0b887dc426ed2d fix(journey page): maintain map position on menu toogle
91b277fad312e2dba3986fb118e4f0e2ad669082 add: inventory logs type & table
a4dccac2255856dd8ecc2e818fcad18fb67b611c fix(step checkout): amountPaid registered        
d0fdc6cca44eb18b303af61fa42e35f7ff484f69 fix(step checkout): exchange amount calculation  
3a7ccc24ca681ce191152c6bd1998b37d199c3e5 add: product detail (UI)
1d22cc15fe1ab7054a2d66e0b3d677fea5f4a961 add(visit): costPrice property
18e1521ca29a2781396fa89160206aa76480e6f3 fix(store visit): currentDebt lost value
492ae77ebda0d03e5296d78decd1b4870f33cb71 update(product): archive soft delete
7a2e7675069a9bb9e68ed450e705ae24900c9276 fix(product type): change retailPrice to costPrice for visit service
250327ccccfa272f2e9f884cc2dc3e5ff426daad remove(types): consignment
f7faccafbf983e02d8cdb2bd4c4b296b26da6ffb fix(product service): 0 warehouseStock default value"
f3d69d2cd2034d7cf238e70e5f06ea0a245cf8dd remove(product form modal): warehouseStock input (default 0)
aefcb611f1238272c1f4e639d23410e02991fbc2 fix(finance page): monthly data
a7b72e1e0f6942c8de1637e422e069be16af8f90 fix(dashboard page): 7 days data



























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
