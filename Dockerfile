FROM node:lts-alpine

# Instalar un servidor estático ligero
RUN npm install -g serve

WORKDIR /app

# Copiar los archivos del proyecto
COPY . .

# Exponer el puerto 80
EXPOSE 80

# Servir los archivos estáticos
CMD ["serve", "-s", ".", "-l", "80"]
