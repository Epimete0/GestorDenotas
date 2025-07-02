-- CreateTable
CREATE TABLE "UsuarioEstudiante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UsuarioEstudiante_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEstudiante_email_key" ON "UsuarioEstudiante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEstudiante_estudianteId_key" ON "UsuarioEstudiante"("estudianteId");
