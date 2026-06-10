git --no-pager log 79c84e656a361aa37bc397241596eadaa2f59cc8..HEAD --pretty=format:"%H %s"
068c5a62ba80f2118cecd8ca2bc877bdb5ab9bde fix header title
574c391280eee05adc44b86c1a6ca6d19e1a0248 update file naming convention
a6a36cb07f772e1ee16d768c89fe78d50f61b73d fix(product service): query invalidate on inactive type
c0e67f2a0993a0325f88463bcda2f3482b9d0642 update(product form): toast usage on success and error 
9386f94dee86857fa4fc5e2a2e0f5bb059641e91 add toast setup
783294ff658ac8cf7454a885c7d3ca46c0c1a332 update(product detail): get product service integration
4753b58612001110e32d7faeaf4c59579dddff63 fix(product form): leave  confirmation modal leak
32c60b075a4ed00ea5d886c0e96b8cef5d6bf97f add product detail
536ca03d5d7dca50442a5f2af1e90dde93087e19 update(db): migration
d1150aa1d3c3ec8abad314ddf7ecd549c8817bfb update(product list): get product service integration
448d0f78136cee5c028172c24f520ad56c310271 update(product form): add product service integration
ce44941bc8c2f10ea5532dfd55ec9ee3c3811b3a add tanstack query provider
74ab1be62e6ab6f9f9f2ef640184a9f507b1bf3e add unique constraint on product name
ce3d894745d443313392a1ebd7e014a14657d93d fix(product form): clear input value on leaving
08e30a9c9e3e4b095105684887dc01044148620e refactor(product form): reusable text-input component
b58e2d0553ffd8e0ae0d3ec7c4f8ad1f70f8504a update(product form): label & placeholder wording
6c24a4242972d6c5353c6c047f401f6f70cd80a1 add input validation on product form
7e6ca207c5c69288aa32e81c47c12f40ca13d3ab add leaving confirmation modal on product form
0b34bae84afefdcd64239e19c2ae72f3fd713a8e fix bottom tab bar navigation on non-primary page
6f4b4ad24c7055a377fece729037b24881c681e5 fix product form header title
4d9dbc3e8c21bc9a55725658ece3346de27d9f16 fix router back (history)
baf738a941598cedcc6ccf754848ee3057635e39 add product form (UI, add mode)
d7d7df5950adb3fbb48f103d29cd72940155bb78 update(action toolbar): modular bottom modal & revert auto-close filter modal
636052d634b275250d2c262f4b4b7a804637afa6 update: downgrade async storage package version
df15718ab0a6957b5bebb95a4e558852ff224f71 update(action toolbar): disable auto-close on filter change
fff262391970c41893c2082fb0ff478ab32ab778 add product preference service (read)
0eeedf85533d2e5ace5178112007e43762e40a06 add async storage package
38eac36e40e8d903ccae0dc2153f9a8382efddbe add: item card
ecc686020b91c0dcf0a888a1c04143608edda12c add drizzle migration setup on main layout
15996356e7f7b570cdde56b5f02ed60f53c1ead2 add babel inline import plugin (.sql)
a35120803a3564f476321e2cec1ac471a83b38ec add drizzle migration file
a67416e6bc07a2dc04e4edda6eeec0e80d8f4474 add db connection config
608bf889ad27c31dbd0514bb49a8d262f30e33af add product table schema & form type





git --no-pager log 3fcde5697f4a847a6bfed3156d7c8b94a8590310..HEAD --pretty=format:"%H %s"
43d528d749ae81ec990c9bc33197d3ac44e34a24 add: action toolbar
0f9d6ce2030850737a1546d903ea096a6e393640 update(header): primary bg color
da798e739877b0ce70ca44bff40de26c9a5f2d64 add: header
bb2cc3360a0fcee765cec51ea2acfc70dd43ad11 update(agents rules): prohibit react native reusable usage912b62f7265c53e2a555fa546339ec21248eba25 update(agents rules): prohibit terminal code manipulation
29c1870310474a97e3600c02a0ec96e5f5eeb46d add: on app leave confirmation modal
3891b02b507a70053428d514a86b0bc3eb036dd1 update(bottom tab bar): color & padding
b7df74cbbc8b72eebe717aeb9c9b7e6f69f49489 fix(tailwind config): hsl syntax (comma)
e2259c6e6e779a0aad8bdb5b1ff1ff33a58a249f add: bottom tab bar
dd07f7eb2242ffb43d87ca258f2cfa56c0a0597f add: tailwindcss-animate package
ce20606dc7d0a6e10aba51d1a303debce4953dce update(css): font installation & setup
57eb3d80cda85d16e99b7c445604d26d0896f700 add: tailwind design tokens
94739eaa4ad704ddc3c14be07d803d372a626c70 add: packages
95377abebee73c3678d1eed78f7278ef5cf50d4e delete: react native tabs default files
4e001ab418254b3a4ac22e5bb786cec7256f3317 update: agent rules
d8edfedb8347a839f513f23eef294e58e87d44bf add: tailwindcss configuration
f56f6dcf9d2ce17e3a8217e65536642cc51dbbf5 add expo skills agent
a31cc6a3daaa5b4463a4c2edf556f693af4890ab install expo init





git --no-pager log 34aa8d65c480e34d97f4b53ed27adf8a9a641330..HEAD --pretty=format:"%H %s"
6112a7bff324a94789a70c792e93e39d3a75c405 remove(backup service): comment excel import & function
2ecc340f65a988195580d43bf9288f7f08fa6e17 update(settings page): enable export JSON format
99a6c1252dfc19fb948f988160f12a5fdcda9300 update(backup service): excel export file format
2b2b4fafb6c868d531bd8502fa57344cb22d72ec update(update & store detail): ui style consistency       
d6c9c99ae3b4c83def5b9e49c8bd63eb0c26662f update(update & store form): ui style consistency
5d3f2d0d804519e3d821410614cd5bce88a1331e fix: show product form confirmation modal on leaving      
11412f7b7323a42dd05d95d3e19f82c671a45b66 fix: add product router path
d1bea0b5b06543b7d4dca12067f8ccb5f751e7c9 cleanup: unused form property type & validation function  
0735a55d616eb66de7301bfa957d9d815ac6f041 remove: fallback response message
b4ef8fa2b9f71911c9160a865ba1dbd8c467a25a remove: remove response.data check on .success true       
d6573946e0cab80765de9e77ed522b0a0c16563c update(services): discriminated union return type
f44bd336f5d3a54598c2d0a4223580e214f9037d remove: unused import & variable
6e97942be0a2b367764ba679ebc390037446c761 remove: unused trycatch
00ab91b551770093ec70cc0820dcc87cb3a585f5 update(services): add trycatch
c22d4e96c6f4c79e26205018a73716a3d20a7ea8 refactor: remove try finally
74cbbec0c554eec38ef4c4dbf987dd66ef79a253 remove(product & store list): unused trycatch block       
774c2567d071c5e702c34da231f4aa1753265f86 add(settings page): backup .xlsx file format
df2a91f3dd11853b14d5c29f5bbc6229e6d94798 add(package json): exceljs & file-saver
bbd067d3660e60299a2805154c9b7c8cf4c52938 remove(db): table users





git --no-pager log 605705415a9f54fabe09c438fa287c0d74483850..HEAD --pretty=format:"%H %s"
c7f09b23db0c9719ae6b0d6aab7582e299a8d1dd fix: TS unused variables & imports
62547fbc71787d9963411b4d0f475e2c598e369e update(db config): remove unused index & migration config     
1c6c6f74dac4ff54c848a6e94050ca1fd5e334a6 update(store & product detail): data pulling limit explanation
d8c5dc3f28f86d5251f9ed6edea2b708aa2533c4 update(getById store service): only 10 last visit data
e2157f6bfa2a5ef7bc8cb9384640da3a4d597881 update(dashboard page): history card color
c26611490d2d1fe6f8bdd3576751e703d27e2278 update(profile menu): use section card
727849b500e0489e4a522dc061c850429ecad3fd update(store visit): add confirmation when user already done visit today
6c8c34620ed88ddf0fdef916f3b7685f33e86404 update(store & product detail): add recover from archive feature
6e47503ad6b0234e5c65bf930a7d95bf728b1bdf update(product form): connect archive buttonto product service
b210f293a7063e5bf10855d76afab22808f6294c update(product & store list): add Archived item filter
7d3420cde047369b53c08a2ab622da7877434fe0 update(get detail product service): only fetch previous 1 month inventory logs
b8af1211a9d6ea58e28b5f1dbe62bcc6eb5c5e8e refactor(product & store list): migrate search and filter state to URL params
d1d252c8c814c11f10be21d33e334fc603fc4e5b update(settings page): use section card
5dfe29f0398bd60bb75457a23634d42e53af38e8 update(dashboard page): use section card
a883a1bf8578810d4f39aa47ac390c52ad015fe0 update(financial page): sticky detail tab
13945e402ebfd250201b1b5275cee4e8f8b2cf9e update(finance page): use section card
a4870f2a30e56f4f113a8edc09d51ecb070db80e update(store detail): section card usage consistency
f07ba15c13e601e2a5fe11c6d476386e4d3d375c update(product & store form): use section card
b442c8dc247c49643ee66e4425999d2111a73200 refactor: move add product form from modal to /new page url
4c2abf36477787e132e18d233ae15a3d628207c9 update(store & product form): replace url to /:id on create success
e782d1a1ba65b42229db0836ed6429a9afcfd21d update(product edit modal): dual mode (add &edit
f369f2cb4ea435bc345643e34ff476356e1bd625 update: action toolbar & item card color
546567879c372769d60524ba4a7b5f908138d2e8 update: reusable item card for both product & store list
52325a59d857742e7d6703517b17e2c5367146a7 update(store card): use section card layout component
22fc21110b0e9516256958a1fc2bc8274b79f7d3 refactor: modular stat-card component
b285f758e5b907608fd6572c8d7c23a0b4159943 refactor: reusable section card
b370093577fdeade3e1995a27b0145e4e17fa49f refactor: reusable back button
6843d252bccf22092cab50c4816a892e4513a59c update(store detail): move delete button into store form (and change wording to archive)    
0acaebef9193e79a99d1ebf162413dd40437859a update: navigate -1 on back button
0f50cb7a7874182fe180e4a61c2bba97233a9c91 update(store service): soft delete (archive)
dda8fb86e34bea7464aa8f9b46387f55b833e2d0 update(journey service): merge getInitialStores & getOptimalRoute
7c8177f4ffb3c67cd9ff45bb6d1b25618e4606d1 update(journey service): optimize store data extraction (filter first then toArray)
7755638b9e39e90681c788fad4ef48480eb433f7 delete unused files
7ffd8980060141cadccf843832097e2ef956a4e6 delete design folder





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





git --no-pager log eb80b3455341dcf86f1370ddddea70d78cc91a77..HEAD --pretty=format:"%H %s"
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