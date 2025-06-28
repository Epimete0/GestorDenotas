"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./config/prisma");
// Importa TODOS tus controllers:
const courseController_1 = __importDefault(require("./controllers/courseController"));
const gradeController_1 = __importDefault(require("./controllers/gradeController"));
const estudianteController_1 = __importDefault(require("./controllers/estudianteController"));
const summaryController_1 = __importDefault(require("./controllers/summaryController"));
const asignaturaController_1 = __importDefault(require("./controllers/asignaturaController"));
const profesorController_1 = __importDefault(require("./controllers/profesorController"));
const asistenciaController_1 = __importDefault(require("./controllers/asistenciaController"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const observacionController_1 = __importDefault(require("./controllers/observacionController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta raíz
app.get("/", (_req, res) => {
    res.send("🚀 Bienvenido al Backend del Sistema de Gestión Escolar");
});
// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "OK" });
});
// Test de Prisma (lista de estudiantes)
app.get("/api/test", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiantes = yield prisma_1.prisma.estudiante.findMany();
        res.json({ estudiantes });
    }
    catch (err) {
        next(err);
    }
}));
// Rutas de autenticación (públicas)
app.use("/api/auth", authRoutes_1.default);
// Rutas sin autenticación para pruebas
app.use("/api/courses", courseController_1.default);
app.use("/api/grades", gradeController_1.default);
app.use("/api/estudiantes", estudianteController_1.default);
app.use("/api/asignaturas", asignaturaController_1.default);
app.use("/api/profesores", profesorController_1.default);
app.use("/api/asistencias", asistenciaController_1.default);
app.use("/api/summary", summaryController_1.default);
app.use("/api/observaciones", observacionController_1.default);
// Manejador de errores
app.use((err, _req, res, _next) => {
    console.error("💥 Error en el servidor:", err);
    res.status(500).json({ error: "Internal server error" });
});
// Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
