# ---- build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy source and build
COPY . .
# Use Maven Wrapper if present, otherwise system mvn
RUN chmod +x mvnw || true
RUN ./mvnw -q -DskipTests package || mvn -q -DskipTests package

# ---- run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Respect platform-provided port (Render/Heroku/etc.). Default to 8080 locally.
ENV PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

# Wire Spring to the port via env (no code changes needed)
ENV SPRING_APPLICATION_JSON='{"server":{"port":"'${PORT}'"}}'

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
