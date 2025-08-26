# -- Etapa 1: Compilación de la aplicación Angular --
FROM node:18-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de dependencias para acelerar la instalación
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install -f

# Copia el resto del código fuente del proyecto
COPY . .

# Compila la aplicación de Angular para producción
# El flag --output-path especifica el directorio de salida
RUN npm run build -- --output-path=./dist/fuse --base-href=/

# -- Etapa 2: Servir la aplicación compilada con Nginx --
# Usa una imagen base de Nginx ligera (alpine)
FROM nginx:1.25-alpine

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos compilados desde la etapa 'build'
COPY --from=build /usr/src/app/dist/fuse /usr/share/nginx/html

# Expone el puerto por defecto de Nginx
EXPOSE 80

 
CMD ["nginx", "-g", "daemon off;"]