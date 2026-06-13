12 June 2026
<details>
- updated step checkout: text & opname product detail
- fixed store visit: leaving confirmation modal on hardware press & bottom tab bar navigation
- updated store visit: service integration
- updated db: register & migration visit table
- added db: visit & visit item table
- updated settings: add custom settings feature
- added store visit UI
- updated store form: add edit mode
- added store detail page (UI & getById service integration)
- updated map picker: add view mode
- updated dev build config
- added packages: notification, datepicker, charts
- fixed store form: header title & bottom tab bar active tab & required lng lat field & exit form confirmation
- added store list page (UI & service integration)
- added store form (create mode)
- added store service (create & get)
- fixed package: downgrade expo location version
- updated app config: add package name & google maps apikey config
- added package: dotenv, expo-location & react-native-maps
- fixed product form: reset field
- updated error services handling with modal
- updated modal: add custom onclick handler
- updated settings service: add stores into backup data  
</details>

11 June 2026
<details>
- added db: stores table & migration
- added export, import & reset database feature
- added package: document picker, file system, sharing       
- refactored db schema: separate entity schema file
- updated product detail: fix logs hour & add relative time 
- removed process return reason field
- updated product detail: get product inventory logs service integration
- added db inventory-log table & migration
- updated action toolbar: add reset button & active filter chips
- updated header: profile icon size
- updated product detail: back button text
- updated product form: archive confirm modal text
- updated product detail: recover product service integration
- updated product form: archive product service integration 
- updated leave form confirmation:from alert to custom modal
- fixed product form: active bottom tab bar
- updated get all product service: abjad ascending
- updated hardcoded style value into constant css usage
- refactored css value into constant for icon style usage
- updated product form: edit product service integration    
- updated product detail: edit product services integration (add stock, edit stock, process return)
- updated product detail: empty state text style
- updated exit app confirmation: change system alert to custom modal usage
- added modal component
- fixed product detail: icons color
</details>

10 June 2026
<details>
- updated file naming convention
- fixed product service: query invalidation on inactive query type
- updated product form: toast usage on success and error 
- added toast setup
- updated product detail: get product service integration
- fixed product form leave confirmation modal leak
- added product detail (UI)
- updated product list: get product service integration
- updated product form: add product service integration
- added tanstack query provider
- added unique constraint on product name
- fixed product form: clear input value on leaving
- refactored product form reusable text input component
- added input validation & leave confirmation modal on product form
- fixed bottom tab bar navigation on non-primary page
- fixed product form header title
- fixed router back (history)
- added product form (UI, add product mode)
- updated action toolbar: modular bottom modal & revert auto-close filter modal
- added product preference service (read)
- added async storage package
- added item card component
- added db connection config & drizzle migration setup on main layout
- added product table schema & form type
</details>

9 June 2026
<details>
- added action toolbar
- updated header bg color (bold primary)
- added header
- updated agents rules: prohibit terminal code manipulation & prohibit react native reusable usage
- added on app leave confirmation modal
- updated bottom tab bar color & padding
- fixed tailwind config hsl syntax (comma)
- added bottom tab bar
- added tailwindcss-animate package
- fixed css font installation & setup
- added tailwind design tokens
- added packages
- deleted react native tabs default files
- updated agent rules (react native focus)
- added tailwindcss configuration
- added expo init & agent skills
</details>


8 June 2026
<details>
- updated excel import & function (temporary comment for small build size)
- updated settings page: enable export JSON format
- added product analysis sheet on backup excel file format     
- Updated UI styles for consistency
- fixed missing confirmation modal on leaving product form      
- fixed add product router path
- removed fallback message & response.data check on .success true
- updated services: complete trycatch guard & discriminated union return type
- removed unused trycatch & tryfinally block       
- added backup excel (.xlsx) file format service
- added exceljs & file-saver package
- removed db table users
</details>


5 June 2026
<details>
- fixed TS unused variables & imports
- removed unused index & migration on db config
- updated store & product detail: data pulling limit explanation
- updated getById store service: only 10 last visit data
- updated dashboard page: history card color
- updated store visit: add confirmation when user already done visit today
- updated store & product detail: add recover from archive feature
- fixed product form: connect archive button to product service
- updated product & store list: add Archived item filter
- updated get detail product service: only fetch previous 1 month inventory logs
- refactored product & store list: migrate search and filter state to URL params
- updated financial page: sticky detail tab
- refactored: use consistent section card custom layout on store detail, product & store form, finance page, dashboard page, settings page, profile menu
- refactored move add product form from modal to /new page url
- updated store & product form: replace url to /:id on create success
- updated product edit modal: dual mode (add &edit)
- updated action toolbar & item card color
- updated reusable item card for both product & store list
- updated : use section card layout component
- refactored: reusable back button, section card, stat card 
- updated store detail: move delete button into store form (and to archive)
- updated back button (navigate -1)
- updated store service: soft delete (archive)
- updated journey service: merge getInitialStores & getOptimalRoute, optimize store data extraction (filter first then toArray)
- deleted unused files
</details>


4 June 2026
<details>
- updated store detail: add back button, change edit delete button & history tabs UI style
- updated store detail: remove font bold & font black
- updated action toolbar: sticky on scroll
- fixed product getAll service: avoid full table scan on category filter
- fixed visit create: cancel transaction on not found product
- fixed backup & settings service: add inventory logs table
- fixed modals breakpoint
- removed breakpoint classes
- updated app width layout into mobile only
- updated hardcoded classes to design tokens
- updated product detail & edit: consistent size classes
- fixed store & product card: prevent repeated localstorage hit & function declaration
- fixed prevent recreate static code on rerender
- refactored reuse mobile bottom drawer
- fixed tailwind animate import
- deleted unused packages
- updated product & store service: change search query from includes to startsWith
- fixed store service: first sorting on getAll
- deleted unused file & imports
- deleted up backend & docs folder
</details>


3 June 2026
<details>
- updated process return modal styling color (text color & recycle theme)
- implemented product service on add stock modal & process return modal     
- updated product detail page fontsize
- fixed product detail (back button navigation)
- updated product edit page styling (size, color, layout),  wording & add empty state
- updated product detail color
- implemented integrate product service on edit stock modal
- updated product & store service (default abjad a-z order)
- updated product filter stock level wording      
- updated visit create service (update product returnedStock on finish)
- implemented product service on product edit page
- updated product form modal (remove edit mode & change fields wording)
- refactored validation util (separate product validation)
- updated products page: remove edit & delete btn, card onclick navigation (detail page)
- implemented product service on product detail page
- updated edit product modal into separate page
- refactored product detail: modularization edit product info, add stock, edit stock, process return
- updated visit create service (hit inventory logs)
- updated product detail UI & add modals (edit product information, stock correction, process return)
- updated step checkout to hide amountPaid input & status info on 0 totalBilled
- updated invoice detail "send to my number" button (always show)
- fixed journey page: maintain map position on menu toogle, empty store on overdue filter
- added inventory logs type & table
</details>

2 June 2026
<details>
- fixed visit step checkout: debt lost value, exchange amount calculation, amountPaid value
- added product detail (UI)
- added costPrice on visit record
- updated product hard delete into soft delete (archive)
- fixed variable retailPrice to costPrice on visit service
- removed consignment type
- removed warehouseStock input (default 0) on add product
- fixed analysis date data (7 days & 1 month start date) 
</details>

31 May 2026
<details>
- updated journey page: show user static location
- updated page header: hide notification & add full screen mode toggle
- refactored journey page: journey service
- updated journey page: gps failed handler, distance calculation, priority grouping, leaflet openstreetmap, zoom & scroll map
- cleaned up TS: unused imports, type missmatch
- implemented dashboard page: integrate dashboard service to get data
- updated finance: reduce padding
- added settings page: JSON backup & recovery
- updated action toolbar: fixed max height & overflow hidden
- added settings page: input validation
- added settings page: reset settings data
- fixed journey: route level (fullscreen)
- added store settings: days overdue input & filter
- added react lazy load
- fixed product list: settings navigation query url
- updated dashboard page: new UI
- added store category settings
- added store list: sortBy last visit
- added notification panel (UI)
- added store card: last visit data
- added store detail: last visit data
- added store schema: string lastVisitAt
- updated action toolbar: close filter on select
</details>

30 May 2026
<details>
- added settings page: query instruction
- updated: rename focus mode to journey
- removed settings page: header
- added delete all data setting
- added custom product category setting
- added focus-mode (UI)
- added product category setting (UI & service)
- added low stock treshhold setting
- added settings page (UI)
- added store detail: invoice detail
- added invoice detail: added invoice note generator
- implemented finance: integrate finance api services
- added finance services: finance page api
- removed visit schema: documentNumber
- updated visit service: desc id sort
- implemented visit step checkout: connect paid amount input value into visit create data
- added step checkout: paid amount input (UI)
- updated type: remove visit totalBilled
- updated store detail: show store debt & assetValue
- updated visit service: use db transaction & add store debt & assetValue
- updated type: rename previousReceivable to currentDebt
- updated type: add assetValue property to store type
- updated type: rename store totalReceivable to debt
- updated store visit: container padding
- updated visit step restock: empty state text padding & align
- updated visit step opname: remove disable & move error into toast
- updated store-visit: remove restock item bill charge
- updated validation rules: phone & addess length
- updated store service: warning modal on duplicate store name & phone
- updated store type: optional phone property
- updated store schema: remove unique constraint on name & phone
- added finance UI
- updated input: autocomplete off on repetitive input
- updated store form: sonner notification on gps error
- implemented profile menu input validation
- removed auth guard & pages
- implemented use profile service
- added profile service
- refactored header, sidebar: use profile menu component
- added profile menu component
</details>

29 May 2026
<details>
- cleaned TypeScript errors (unused, null possibility)
- updated docker configs (caddy network, command)
- fixed mobile global load animation
- cleaned up UI & wording 
- refactored pagination navigation; product & store card; action toolbar into separate components
- added & implemented sonner notification (service responses context, in-progress feature)
- added store list empty state
- updated store phone number pattern
- added store owner name & phone number unique constraints (& duplicate handling)
- added not found route fallback
- fixed unique constraint error type on modify action
</details>

28 May 2026
<details>
- deleted seed & old version files
- updated Visit flow: restock option, bill calculation, wording, empty data validation, item details,  
- removed all scrollbar & breadcrumbs
- implemented switch page confirmation on menu navigation (form pages)
- implemented dynamic header title (and removed all pages title)
- implemented input validation (rules, util functions, input property)
- removed setTimeout delay mock, comments & dashboard dummy data
- updated input placeholder (to value example) 
- added catch guard on localstorage JSON parse
- implemented store data analysis extraction
- added db config (indexedDB) & dexie package
- migrated localstorage to indexedDB (product, store & visit services)
- added database schema: primary key, indexing & unique constraint
- updated docker prod config
</details>

27 May 2026
<details>
- added store detail page (UI)
- updated map picker to allow scroll & zoom on view-only mode
- updated store detail: reduce words, reduce vertical gap, show store note, add google maps button, add empty data UI
- implemented localstorage service on store detail (GET store data)
- added edit mode on store form
- removed seed (default data) usage 
- added confirmation modal component
- updated product list: alert (removed), cards UI style (from table), pagination size (to 6)
- added store visit form
- updated store visit form into modular steps component
- added number input component
</details>

26 May 2026
<details>
- implemented localStorage API mock call (GET products)
- added edit & delete product buttons (UI)
- added product description popup on product name hover
- updated product list page: colors, category value, table header alignment
- designed product form modal
- added add & edit product features
- added product search & filter features
- implemented product list pagination
- added floating profile menu
- removed dummy user data & phone input (register)
- updated auth error message UI, leaving hard alert method
- added store list page (UI)
- implemented localstorage-based store list retriever (search & filter query)
- added store form (add) page (UI)
- implemented localstorage-based store list push update
- refactored custom leaflet map picker component (read & write mode)
</details>

25 May 2026
<details> 
- reinitialized juragan titip project with planning approach
- added agent rules
- imported stitch design
- updated tailwind design tokens
- added login and register page (UI only)
- implemented authentication flow (localstorage mock)
- merged dashboard stitch generated design
</details>