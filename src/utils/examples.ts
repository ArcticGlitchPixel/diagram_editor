import type { Language } from './i18n';

export interface Example {
  id: string;
  name: {
    [key in Language]: string;
  };
  code: {
    [key in Language]: string;
  };
}

export const exampleCategories = {
  flowchart: 'flowchart',
  sequence: 'sequence',
  class: 'class',
  state: 'state',
  er: 'er',
  gantt: 'gantt',
  pie: 'pie',
  git: 'git',
  chart: 'chart',
} as const;

export type ExampleCategory = keyof typeof exampleCategories;

export const examples: Record<ExampleCategory, Example[]> = {
  flowchart: [
    {
      id: 'flowchart-login',
      name: {
        'en': 'User Login Flow',
        'es': 'Flujo de inicio de sesión',
      },
      code: {
        'en': `flowchart TD
    Start([Start]) --> Input[Enter Username & Password]
    Input --> Validate{Validate Info}
    Validate -->|Valid| CheckDB[Check Database]
    Validate -->|Invalid| Error1[Display Error]
    Error1 --> Input
    CheckDB --> Match{Match Found?}
    Match -->|Yes| Success[Login Success]
    Match -->|No| Error2[Invalid Credentials]
    Error2 --> Input
    Success --> Dashboard[Go to Dashboard]
    Dashboard --> End([End])`,
        'es': `flowchart TD
    Start([Inicio]) --> Input[Ingresar Usuario y Contraseña]
    Input --> Validate{Validar Información}
    Validate -->|Válido| CheckDB[Verificar Base de Datos]
    Validate -->|Inválido| Error1[Mostrar Error]
    Error1 --> Input
    CheckDB --> Match{¿Coincidencia?}
    Match -->|Sí| Success[Inicio Exitoso]
    Match -->|No| Error2[Credenciales Inválidas]
    Error2 --> Input
    Success --> Dashboard[Ir al Panel]
    Dashboard --> End([Fin])`,
      },
    },
    {
      id: 'flowchart-simple',
      name: {
        'en': 'Simple Decision Tree',
        'es': 'Árbol de decisión simple',
      },
      code: {
        'en': `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix issue]
    E --> B
    C --> F[End]`,
        'es': `graph TD
    A[Inicio] --> B{¿Funciona?}
    B -->|Sí| C[¡Genial!]
    B -->|No| D[Depurar]
    D --> E[Solucionar problema]
    E --> B
    C --> F[Fin]`,
      },
    },
  ],
  sequence: [
    {
      id: 'sequence-payment',
      name: {
        'en': 'Online Payment Process',
        'es': 'Proceso de pago en línea',
      },
      code: {
        'en': `sequenceDiagram
    participant User
    participant Website
    participant PaymentGateway
    participant Bank

    User->>Website: Select items & checkout
    Website->>User: Show payment page
    User->>Website: Enter payment info
    Website->>PaymentGateway: Send payment request
    PaymentGateway->>Bank: Verify payment info
    
    alt Payment successful
        Bank-->>PaymentGateway: Authorization success
        PaymentGateway-->>Website: Payment confirmed
        Website-->>User: Show success message
    else Payment failed
        Bank-->>PaymentGateway: Authorization failed
        PaymentGateway-->>Website: Payment failed
        Website-->>User: Show error message
    end`,
        'es': `sequenceDiagram
    participant Usuario
    participant Sitio Web
    participant Pasarela de Pago
    participant Banco

    Usuario->>Sitio Web: Seleccionar artículos y pagar
    Sitio Web->>Usuario: Mostrar página de pago
    Usuario->>Sitio Web: Ingresar información de pago
    Sitio Web->>Pasarela de Pago: Enviar solicitud de pago
    Pasarela de Pago->>Banco: Verificar información de pago
    
    alt Pago exitoso
        Banco-->>Pasarela de Pago: Autorización exitosa
        Pasarela de Pago-->>Sitio Web: Pago confirmado
        Sitio Web-->>Usuario: Mostrar mensaje de éxito
    else Pago fallido
        Banco-->>Pasarela de Pago: Autorización fallida
        Pasarela de Pago-->>Sitio Web: Pago fallido
        Sitio Web-->>Usuario: Mostrar mensaje de error
    end`,
      },
    },
    {
      id: 'sequence-api',
      name: {
        'en': 'API Authentication',
        'es': 'Autenticación de API',
      },
      code: {
        'en': `sequenceDiagram
    actor User
    participant Client
    participant API
    participant Database

    User->>Client: Enter credentials
    Client->>API: POST /auth/login
    API->>Database: Query user
    Database-->>API: User data
    
    alt Valid credentials
        API->>API: Generate JWT token
        API-->>Client: 200 OK + Token
        Client-->>User: Login successful
    else Invalid credentials
        API-->>Client: 401 Unauthorized
        Client-->>User: Show error
    end`,
        'es': `sequenceDiagram
    actor Usuario
    participant Cliente
    participant API
    participant Base de Datos

    Usuario->>Cliente: Ingresar credenciales
    Cliente->>API: POST /auth/login
    API->>Base de Datos: Consultar usuario
    Base de Datos-->>API: Datos del usuario
    
    alt Credenciales válidas
        API->>API: Generar token JWT
        API-->>Cliente: 200 OK + Token
        Cliente-->>Usuario: Inicio exitoso
    else Credenciales inválidas
        API-->>Cliente: 401 No autorizado
        Cliente-->>Usuario: Mostrar error
    end`,
      },
    },
  ],
  class: [
    {
      id: 'class-ecommerce',
      name: {
        'en': 'E-commerce System',
        'es': 'Sistema de comercio electrónico',
      },
      code: {
        'en': `classDiagram
    class User {
        +int userId
        +string username
        +string email
        +login()
        +register()
        +updateProfile()
    }
    
    class Product {
        +int productId
        +string name
        +decimal price
        +int stock
        +updateStock()
        +getDetails()
    }
    
    class Order {
        +int orderId
        +datetime createdAt
        +decimal total
        +string status
        +createOrder()
        +cancelOrder()
    }
    
    class Cart {
        +int cartId
        +addProduct()
        +removeProduct()
        +clear()
        +calculateTotal()
    }
    
    User "1" --> "0..*" Order : places
    User "1" --> "1" Cart : owns
    Order "1" --> "1..*" Product : contains
    Cart "1" --> "0..*" Product : contains`,
        'es': `classDiagram
    class Usuario {
        +int usuarioId
        +string nombreUsuario
        +string email
        +iniciarSesion()
        +registrar()
        +actualizarPerfil()
    }
    
    class Producto {
        +int productoId
        +string nombre
        +decimal precio
        +int stock
        +actualizarStock()
        +obtenerDetalles()
    }
    
    class Pedido {
        +int pedidoId
        +datetime fechaCreacion
        +decimal total
        +string estado
        +crearPedido()
        +cancelarPedido()
    }
    
    class Carrito {
        +int carritoId
        +agregarProducto()
        +eliminarProducto()
        +vaciar()
        +calcularTotal()
    }
    
    Usuario "1" --> "0..*" Pedido : realiza
    Usuario "1" --> "1" Carrito : posee
    Pedido "1" --> "1..*" Producto : contiene
    Carrito "1" --> "0..*" Producto : contiene`,
      },
    },
  ],
  state: [
    {
      id: 'state-order',
      name: {
        'en': 'Order State Machine',
        'es': 'Máquina de estados de pedido',
      },
      code: {
        'en': `stateDiagram-v2
    [*] --> Created: Create Order
    Created --> Paid: Payment Success
    Created --> Cancelled: Cancel Order
    Paid --> Processing: Start Processing
    Processing --> Shipped: Ship Items
    Shipped --> Delivered: Confirm Delivery
    Delivered --> [*]
    Cancelled --> [*]
    
    Processing --> Cancelled: Cancel Request
    Shipped --> Returned: Return Request
    Returned --> [*]`,
        'es': `stateDiagram-v2
    [*] --> Creado: Crear Pedido
    Creado --> Pagado: Pago Exitoso
    Creado --> Cancelado: Cancelar Pedido
    Pagado --> Procesando: Iniciar Procesamiento
    Procesando --> Enviado: Enviar Artículos
    Enviado --> Entregado: Confirmar Entrega
    Entregado --> [*]
    Cancelado --> [*]
    
    Procesando --> Cancelado: Solicitud de Cancelación
    Enviado --> Devuelto: Solicitud de Devolución
    Devuelto --> [*]`,
      },
    },
  ],
  er: [
    {
      id: 'er-blog',
      name: {
        'en': 'Blog Database Schema',
        'es': 'Esquema de base de datos de blog',
      },
      code: {
        'en': `erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : makes
    POST ||--o{ COMMENT : has
    POST }o--|| CATEGORY : belongs_to
    POST }o--o{ TAG : has
    
    USER {
        int user_id PK
        string username
        string email
        datetime created_at
    }
    
    POST {
        int post_id PK
        int user_id FK
        int category_id FK
        string title
        text content
        datetime published_at
    }
    
    COMMENT {
        int comment_id PK
        int user_id FK
        int post_id FK
        text content
        datetime created_at
    }
    
    CATEGORY {
        int category_id PK
        string name
    }
    
    TAG {
        int tag_id PK
        string name
    }`,
        'es': `erDiagram
    USUARIO ||--o{ PUBLICACION : escribe
    USUARIO ||--o{ COMENTARIO : hace
    PUBLICACION ||--o{ COMENTARIO : tiene
    PUBLICACION }o--|| CATEGORIA : pertenece_a
    PUBLICACION }o--o{ ETIQUETA : tiene
    
    USUARIO {
        int user_id PK
        string nombreUsuario
        string email
        datetime fecha_creacion
    }
    
    PUBLICACION {
        int post_id PK
        int user_id FK
        int category_id FK
        string titulo
        text contenido
        datetime fecha_publicacion
    }
    
    COMENTARIO {
        int comment_id PK
        int user_id FK
        int post_id FK
        text contenido
        datetime fecha_creacion
    }
    
    CATEGORIA {
        int category_id PK
        string nombre
    }
    
    ETIQUETA {
        int tag_id PK
        string nombre
    }`,
      },
    },
  ],
  gantt: [
    {
      id: 'gantt-project',
      name: {
        'en': 'Project Timeline',
        'es': 'Cronograma del proyecto',
      },
      code: {
        'en': `gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Analysis    :a1, 2024-01-01, 10d
    Design Mockups          :a2, after a1, 15d
    section Development
    Backend API             :a3, 2024-01-26, 20d
    Frontend UI             :a4, after a3, 15d
    Integration             :a5, after a4, 10d
    section Testing
    Unit Testing            :a6, after a5, 7d
    Integration Testing     :a7, after a6, 5d
    section Deployment
    Production Deployment   :a8, after a7, 3d`,
        'es': `gantt
    title Cronograma de Desarrollo del Proyecto
    dateFormat YYYY-MM-DD
    section Planificación
    Análisis de Requisitos :a1, 2024-01-01, 10d
    Diseño de Mockups      :a2, after a1, 15d
    section Desarrollo
    API Backend            :a3, 2024-01-26, 20d
    UI Frontend            :a4, after a3, 15d
    Integración            :a5, after a4, 10d
    section Pruebas
    Pruebas Unitarias      :a6, after a5, 7d
    Pruebas de Integración :a7, after a6, 5d
    section Despliegue
    Despliegue a Producción :a8, after a7, 3d`,
      },
    },
  ],
  pie: [
    {
      id: 'pie-market',
      name: {
        'en': 'Market Share',
        'es': 'Cuota de mercado',
      },
      code: {
        'en': `pie title Market Share Distribution
    "Company A" : 35
    "Company B" : 25
    "Company C" : 20
    "Company D" : 12
    "Others" : 8`,
        'es': `pie title Distribución de Cuota de Mercado
    "Empresa A" : 35
    "Empresa B" : 25
    "Empresa C" : 20
    "Empresa D" : 12
    "Otros" : 8`,
      },
    },
  ],
  git: [
    {
      id: 'git-workflow',
      name: {
        'en': 'Git Workflow',
        'es': 'Flujo de trabajo Git',
      },
      code: {
        'en': `gitGraph
    commit id: "Initial commit"
    branch develop
    checkout develop
    commit id: "Add feature A"
    commit id: "Add feature B"
    checkout main
    merge develop
    commit id: "Release v1.0"
    branch hotfix
    commit id: "Fix critical bug"
    checkout main
    merge hotfix
    commit id: "Release v1.0.1"`,
        'es': `gitGraph
    commit id: "Commit inicial"
    branch develop
    checkout develop
    commit id: "Añadir función A"
    commit id: "Añadir función B"
    checkout main
    merge develop
    commit id: "Lanzamiento v1.0"
    branch hotfix
    commit id: "Corregir error crítico"
    checkout main
    merge hotfix
    commit id: "Lanzamiento v1.0.1"`,
      },
    },
  ],
  chart: [
    {
      id: 'chart-line',
      name: {
        'en': 'Line Chart - Sales Trend',
        'es': 'Gráfico de Líneas - Tendencia de Ventas',
      },
      code: {
        'en': `xychart-beta
    title "Monthly Sales Trend"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue ($K)" 0 --> 120
    line [30, 45, 55, 48, 70, 85, 78, 92, 88, 95, 105, 120]`,
        'es': `xychart-beta
    title "Tendencia de Ventas Mensuales"
    x-axis [ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic]
    y-axis "Ventas ($K)" 0 --> 120
    line [30, 45, 55, 48, 70, 85, 78, 92, 88, 95, 105, 120]`,
      },
    },
    {
      id: 'chart-bar',
      name: {
        'en': 'Bar Chart - Quarterly Revenue',
        'es': 'Gráfico de Barras - Ingresos Trimestrales',
      },
      code: {
        'en': `xychart-beta
    title "Quarterly Revenue Comparison"
    x-axis [Q1, Q2, Q3, Q4]
    y-axis "Revenue ($M)" 0 --> 150
    bar [65, 95, 120, 140]`,
        'es': `xychart-beta
    title "Comparación de Ingresos Trimestrales"
    x-axis [T1, T2, T3, T4]
    y-axis "Ingresos ($M)" 0 --> 150
    bar [65, 95, 120, 140]`,
      },
    },
    {
      id: 'chart-multi',
      name: {
        'en': 'Multi-Series Chart - Product Comparison',
        'es': 'Gráfico Multi-Series - Comparación de Productos',
      },
      code: {
        'en': `xychart-beta
    title "Product Sales Comparison"
    x-axis [jan, feb, mar, apr, may, jun]
    y-axis "Sales Units" 0 --> 200
    line "Product A" [50, 80, 120, 100, 150, 170]
    line "Product B" [30, 60, 90, 110, 130, 145]
    bar "Product C" [40, 70, 85, 95, 105, 115]`,
        'es': `xychart-beta
    title "Comparación de Ventas de Productos"
    x-axis [ene, feb, mar, abr, may, jun]
    y-axis "Unidades Vendidas" 0 --> 200
    line "Producto A" [50, 80, 120, 100, 150, 170]
    line "Producto B" [30, 60, 90, 110, 130, 145]
    bar "Producto C" [40, 70, 85, 95, 105, 115]`,
      },
    },
  ],
};

export const getCategoryName = (category: ExampleCategory, lang: Language): string => {
  const names: Record<ExampleCategory, Record<Language, string>> = {
    flowchart: {
      'en': 'Flowchart',
      'es': 'Diagrama de Flujo',
    },
    sequence: {
      'en': 'Sequence Diagram',
      'es': 'Diagrama de Secuencia',
    },
    class: {
      'en': 'Class Diagram',
      'es': 'Diagrama de Clases',
    },
    state: {
      'en': 'State Diagram',
      'es': 'Diagrama de Estados',
    },
    er: {
      'en': 'ER Diagram',
      'es': 'Diagrama ER',
    },
    gantt: {
      'en': 'Gantt Chart',
      'es': 'Diagrama de Gantt',
    },
    pie: {
      'en': 'Pie Chart',
      'es': 'Gráfico Circular',
    },
    git: {
      'en': 'Git Graph',
      'es': 'Gráfico Git',
    },
    chart: {
      'en': 'Line & Bar Charts',
      'es': 'Gráficos de Líneas y Barras',
    },
  };
  
  return names[category][lang];
};

// Find example by ID across all categories
export const findExampleById = (id: string): { category: ExampleCategory; example: Example; index: number } | null => {
  for (const [category, exampleList] of Object.entries(examples)) {
    const index = exampleList.findIndex(ex => ex.id === id);
    if (index !== -1) {
      return {
        category: category as ExampleCategory,
        example: exampleList[index],
        index
      };
    }
  }
  return null;
};

