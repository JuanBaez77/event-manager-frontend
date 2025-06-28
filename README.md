# Event Manager Frontend

Frontend para el sistema de gestión de eventos construido con React, TypeScript y Material UI.

## Tecnologías

- React 18
- TypeScript
- Material UI
- React Router DOM
- React Hook Form
- Axios
- Vite

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── services/      # Servicios de API
├── hooks/         # Hooks personalizados
├── types/         # Definiciones de tipos TypeScript
├── App.tsx        # Componente principal
└── main.tsx       # Punto de entrada
```

## Características

- Autenticación con JWT
- Interfaz responsive con Material UI
- Validación de formularios con React Hook Form
- Manejo de estado global con Context API
- Interceptores de Axios para manejo de errores
- Tipado completo con TypeScript 