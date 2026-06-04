
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