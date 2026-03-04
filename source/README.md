# Lumisa WeChat Mini Program

[![Platform](https://img.shields.io/badge/Platform-WeChat-green.svg)](https://mp.weixin.qq.com/)
![Status](https://img.shields.io/badge/Status-Development-orange.svg)

[中文](#中文) | [Español](#español)

<div id="中文"></div>

## 🇨🇳 中文

### 项目介绍

**Lumisa 微信小程序** 旨在为用户提供便捷、透明的能源管理服务。用户可以通过小程序轻松查看账单、订阅能源服务、联系客户支持，并享受中西文双语的无缝切换体验，专为服务当地华人及本地社区打造。

### 🌟 核心功能

#### 1. 首页 (Home)

- **Banner 轮播**: 展示最新市场活动、品牌宣传及重要通知。
- **快捷菜单**: 快速导航至核心模块：关于我们、资费套餐、服务介绍、新闻资讯、联系我们及个人账户。
- **国际化切换**: 支持跟随系统语言自动适配，或用户手动实时切换中/西文。

#### 2. 账单 (Invoice)

- **账单列表**: 清晰展示历史账单信息，包括发票号、支付状态、日期、计费周期及金额。
- **详情与下载**: 提供账单详情查阅及模拟 PDF 下载功能，方便用户管理财务。

#### 3. 服务 (Services)

- **服务概览**: 全面展示 Lumisa 核心业务：电力套餐、太阳能光伏、虚拟电池、热泵系统、充电桩及 PPA 服务。
- **核心优势**: 强调透明定价、全线上办理、无合约绑定等品牌特质。
- **常见问题 (FAQ)**: 交互式问答列表，快速解决用户疑虑。

#### 4. 个人中心 (Mine)

- **用户信息**: 展示用户头像及基本信息。
- **功能入口**: 集成“我的合同”、“推荐好友”、“客户服务”等常用功能。
- **身份认证**: 智能识别登录状态，提供便捷的登录/注册入口。

#### 5. 认证模块 (Auth)

- **登录**: 支持邮箱安全登录。

#### 6. 其他页面

- **关于我们**: 讲述 Lumisa 品牌故事与核心价值观。
- **资费套餐**: 详细列出电力套餐价格与条款。
- **联系我们**: 展示多渠道联系方式及在线留言表单。

### 🏗 技术架构

- **框架**: 微信小程序原生开发 (WXML, WXSS, JS, JSON)，保证最佳性能与兼容性。
- **设计模式**: 遵循标准 MVC 分层架构，代码结构清晰，易于维护。
- **UI/UX**: 采用自定义 CSS 变量 (`app.wxss`) 与 Flexbox/Grid 布局，打造响应式、现代化的用户界面。
- **国际化 (i18n)**: 自研轻量级 i18n 模块 (`utils/i18n.js`)，支持多语言实时热切换，无需重启小程序。
- **数据层**: 采用 Mock Data 进行前端独立开发与测试，接口设计遵循 RESTful 规范，已为后端对接做好充分准备。

### 📂 目录结构

```text
source/
├── pages/                  # 页面文件目录
│   ├── index/              # 首页模块
│   ├── invoice/            # 账单模块
│   ├── services/           # 服务模块
│   ├── mine/               # 个人中心模块
│   ├── login/              # 登录页
│   ├── about/              # 关于我们
│   ├── packages/           # 资费套餐
│   └── contact/            # 联系我们
├── utils/
│   └── i18n.js             # 国际化核心工具
├── components/             # 公共组件库
├── behaviors/              # 共享 Behaviors
├── assets/                 # 静态资源 (图片、图标)
├── app.js                  # 小程序逻辑入口
├── app.json                # 全局配置文件
└── app.wxss                # 全局样式表
```

### 🚀 快速开始

1.  **环境准备**: 下载并安装最新版 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2.  **导入项目**: 打开工具，选择“导入项目”，项目目录指向 `source` 文件夹。
3.  **AppID 配置**: 使用测试号 AppID 或您申请的正式 AppID。
4.  **编译预览**: 点击工具栏的“编译”按钮，即可在模拟器中预览效果。

### 🌍 国际化说明

项目内置完善的中西文语言包管理机制：

- **翻译文件**: 所有翻译词条按模块存放于 `utils/i18n/` 目录下，便于管理与维护。
- **实时更新**: 在页面 `onShow` 生命周期中调用 `initLanguage` 和 `updateTabBarLang`，确保语言切换即时生效，覆盖 TabBar 及页面内容。

---

<div id="español"></div>

## 🇪🇸 Español

### Introducción

El **Miniprograma de WeChat Lumisa** está diseñado para proporcionar a los usuarios una gestión energética cómoda y eficiente. Permite a los usuarios consultar facturas, suscribirse a servicios y acceder a soporte al cliente, con soporte completo bilingüe (Español/Chino) para atender a la comunidad diversa.

### 🌟 Características Principales

#### 1. Inicio (Home)

- **Banner Rotativo**: Muestra las últimas promociones y anuncios de la marca.
- **Menú Rápido**: Acceso directo a módulos clave: Nosotros, Tarifas, Servicios, Noticias, Contacto y Cuenta.
- **Cambio de Idioma**: Adaptación automática según el sistema o cambio manual instantáneo.

#### 2. Facturas (Invoice)

- **Historial de Facturas**: Visualización clara de facturas pasadas con detalles como número, estado (pagado/pendiente), fecha, periodo e importe.
- **Detalle y Descarga**: Vista detallada y simulación de descarga de facturas en PDF.

#### 3. Servicios (Services)

- **Catálogo de Servicios**: Presentación de servicios principales de Lumisa: Electricidad, Placas Solares, Batería Virtual, Aerotermia, Cargadores y PPA.
- **Propuesta de Valor**: Destacando transparencia, gestión 100% online y sin permanencia.
- **Preguntas Frecuentes (FAQ)**: Sección interactiva para resolver dudas comunes.

#### 4. Mi Cuenta (Mine)

- **Perfil de Usuario**: Panel personal con información del usuario.
- **Gestión**: Acceso a "Mis Contratos", "Invitar Amigos" y "Atención al Cliente".
- **Autenticación**: Acceso integrado para inicio de sesión.

#### 5. Módulo de Autenticación (Auth)

- **Inicio de Sesión**: Acceso seguro mediante correo electrónico.

#### 6. Páginas Informativas

- **Sobre Nosotros**: Historia de Lumisa, misión y valores.
- **Tarifas**: Información detallada sobre planes de precios de electricidad.
- **Contacto**: Información corporativa y formulario de contacto directo.

### 🏗 Arquitectura Técnica

- **Framework**: Nativo de WeChat Mini Program (WXML, WXSS, JS, JSON).
- **Patrón de Diseño**: MVC (Modelo-Vista-Controlador) estándar.
- **Estilos**: Sistema de diseño con variables CSS (`app.wxss`) y layouts modernos (Flexbox/Grid).
- **Internacionalización (i18n)**: Módulo ligero propio (`utils/i18n.js`) para cambio de idioma en tiempo real sin recarga.
- **Datos**: Arquitectura preparada para API RESTful, actualmente utilizando Mock Data para desarrollo y pruebas.

### 📂 Estructura del Proyecto

```text
source/
├── pages/                  # Vistas de la aplicación
│   ├── index/              # Página de Inicio
│   ├── invoice/            # Gestión de Facturas
│   ├── services/           # Catálogo de Servicios
│   ├── mine/               # Perfil de Usuario
│   ├── login/              # Inicio de Sesión
│   ├── about/              # Sobre Nosotros
│   ├── packages/           # Tarifas
│   └── contact/            # Contacto
├── utils/
│   └── i18n.js             # Gestor de Internacionalización
├── components/             # Componentes Reutilizables
├── behaviors/              # Comportamientos compartidos
├── assets/                 # Recursos estáticos (imágenes, iconos)
├── app.js                  # Lógica Global
├── app.json                # Configuración Global
└── app.wxss                # Estilos Globales
```

### 🚀 Inicio Rápido

1.  **Requisitos**: Descargar e instalar [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html).
2.  **Importar**: Abrir la herramienta, seleccionar "Importar Proyecto" y elegir la carpeta `source`.
3.  **Configuración**: Usar un AppID de prueba o su propio AppID registrado.
4.  **Ejecutar**: Compilar el proyecto para previsualizar en el simulador.

### 🌍 Internacionalización

El proyecto cuenta con un sistema robusto de i18n:

- **Recursos**: `utils/i18n/` contiene los archivos de traducción por módulos.
- **Implementación**: Se utiliza `initLanguage` y `updateTabBarLang` en el ciclo de vida `onShow` para garantizar la persistencia y actualización inmediata del idioma.
