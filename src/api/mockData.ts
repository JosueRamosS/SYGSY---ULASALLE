import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import type { Syllabus, SyllabusStatus, SyllabusUnit, SyllabusEvaluation, CreateSyllabusDTO } from './syllabusApi';
import type { Career } from './careerApi';
import type { AcademicPeriod } from './periodApi';
import type { AuthResponse, LoginRequest, User } from '../types/auth';

// ============================================================
// MOCK BACKEND (in-memory)
// ============================================================
// Reemplaza al backend Spring Boot cuando VITE_USE_MOCK=true.
// Mantiene estado mutable durante la sesión: crear/eliminar/editar
// se ven reflejados hasta que se recargue la página.
// ============================================================

interface MockUser extends User {
    password: string;
    email: string;
}

const careers: Career[] = [
    { id: 1, name: 'Ingeniería de Software' },
    { id: 2, name: 'Ingeniería Industrial' },
    { id: 3, name: 'Derecho' },
];

const periods: AcademicPeriod[] = [
    { id: 1, name: '2026-I', startDate: '2026-03-17', endDate: '2026-07-25' },
    { id: 2, name: '2026-II', startDate: '2026-08-11', endDate: '2026-12-19' },
];

const users: MockUser[] = [
    {
        id: 1,
        username: 'admin@ulasalle.edu.pe',
        email: 'admin@ulasalle.edu.pe',
        password: 'admin123',
        fullName: 'Administrador General',
        role: 'COORDINATOR',
        // sin career => admin
    },
    {
        id: 2,
        username: 'coord@ulasalle.edu.pe',
        email: 'coord@ulasalle.edu.pe',
        password: '123',
        fullName: 'Ana Coordinadora',
        role: 'COORDINATOR',
        career: 'Ingeniería de Software',
    },
    {
        id: 3,
        username: 'prof@ulasalle.edu.pe',
        email: 'prof@ulasalle.edu.pe',
        password: '123',
        fullName: 'Juan Pérez Castillo',
        role: 'PROFESSOR',
        career: 'Ingeniería de Software',
    },
    {
        id: 4,
        username: 'prof2@ulasalle.edu.pe',
        email: 'prof2@ulasalle.edu.pe',
        password: '123',
        fullName: 'María Quispe Vargas',
        role: 'PROFESSOR',
        career: 'Ingeniería de Software',
    },
    {
        id: 5,
        username: 'prof3@ulasalle.edu.pe',
        email: 'prof3@ulasalle.edu.pe',
        password: '123',
        fullName: 'Carlos Mendoza Soto',
        role: 'PROFESSOR',
        career: 'Ingeniería Industrial',
    },
];

const buildUnits = (): SyllabusUnit[] => ([1, 2, 3, 4].map(n => ({
    id: n,
    unitNumber: n,
    title: `Unidad ${n}`,
    startDate: '',
    endDate: '',
    content: '',
    week1Content: '',
    week2Content: '',
    week3Content: '',
    week4Content: '',
    methodology: '',
})));

const buildEvaluations = (): SyllabusEvaluation[] => ([
    { id: 1, name: 'Consolidado 1', consolidationDate: '', description: '' },
    { id: 2, name: 'Examen Parcial', consolidationDate: '', description: '' },
    { id: 3, name: 'Consolidado 2', consolidationDate: '', description: '' },
    { id: 4, name: 'Examen Final', consolidationDate: '', description: '' },
]);

const syllabi: Syllabus[] = [
    {
        id: 1,
        courseName: 'Algoritmos y Estructuras de Datos',
        courseCode: 'SIS101',
        career: 'Ingeniería de Software',
        semester: 'III',
        credits: 4,
        theoryHours: 3,
        practiceHours: 2,
        faculty: 'Facultad de Ingeniería',
        trainingArea: 'Específica',
        courseType: 'Obligatorio',
        prerequisites: 'Programación I',
        professorId: 0,
        status: 'ACTIVE',
        workflowStatus: 'CREATED',
        academicPeriod: { id: 1, name: '2026-I' },
        units: buildUnits(),
        evaluations: buildEvaluations(),
    },
    {
        id: 2,
        courseName: 'Calidad de Software',
        courseCode: 'SIS202',
        career: 'Ingeniería de Software',
        semester: 'VII',
        credits: 4,
        theoryHours: 3,
        practiceHours: 2,
        faculty: 'Facultad de Ingeniería',
        trainingArea: 'Específica',
        courseType: 'Obligatorio',
        prerequisites: 'Ingeniería de Software I',
        professorId: 3,
        status: 'ACTIVE',
        workflowStatus: 'ASSIGNED',
        academicPeriod: { id: 1, name: '2026-I' },
        professor: { fullName: 'Juan Pérez Castillo', email: 'prof@ulasalle.edu.pe' },
        sumilla: 'Estudio de los principios y técnicas de aseguramiento de la calidad del software.',
        courseCompetence: 'Aplica estándares y técnicas de calidad de software en proyectos reales.',
        units: buildUnits(),
        evaluations: buildEvaluations(),
    },
    {
        id: 3,
        courseName: 'Base de Datos II',
        courseCode: 'SIS303',
        career: 'Ingeniería de Software',
        semester: 'V',
        credits: 4,
        theoryHours: 3,
        practiceHours: 2,
        faculty: 'Facultad de Ingeniería',
        trainingArea: 'Específica',
        courseType: 'Obligatorio',
        prerequisites: 'Base de Datos I',
        professorId: 4,
        status: 'ACTIVE',
        workflowStatus: 'SUBMITTED',
        academicPeriod: { id: 1, name: '2026-I' },
        professor: { fullName: 'María Quispe Vargas', email: 'prof2@ulasalle.edu.pe' },
        units: buildUnits(),
        evaluations: buildEvaluations(),
    },
    {
        id: 4,
        courseName: 'Arquitectura de Software',
        courseCode: 'SIS404',
        career: 'Ingeniería de Software',
        semester: 'VIII',
        credits: 4,
        theoryHours: 3,
        practiceHours: 2,
        faculty: 'Facultad de Ingeniería',
        trainingArea: 'Específica',
        courseType: 'Obligatorio',
        prerequisites: 'Ingeniería de Software II',
        professorId: 3,
        status: 'ACTIVE',
        workflowStatus: 'APPROVED',
        academicPeriod: { id: 2, name: '2026-II' },
        professor: { fullName: 'Juan Pérez Castillo', email: 'prof@ulasalle.edu.pe' },
        units: buildUnits(),
        evaluations: buildEvaluations(),
    },
    {
        id: 5,
        courseName: 'Ingeniería de Requisitos',
        courseCode: 'SIS105',
        career: 'Ingeniería de Software',
        semester: 'IV',
        credits: 3,
        theoryHours: 2,
        practiceHours: 2,
        faculty: 'Facultad de Ingeniería',
        trainingArea: 'Específica',
        courseType: 'Obligatorio',
        prerequisites: 'Programación II',
        professorId: 4,
        status: 'ACTIVE',
        workflowStatus: 'RETURNED',
        academicPeriod: { id: 2, name: '2026-II' },
        professor: { fullName: 'María Quispe Vargas', email: 'prof2@ulasalle.edu.pe' },
        units: buildUnits(),
        evaluations: buildEvaluations(),
    },
];

let nextSyllabusId = 100;
let nextUserId = 100;
let nextCareerId = 100;
let nextPeriodId = 100;

// ============================================================
// Helpers
// ============================================================

const toPublicUser = (u: MockUser): User => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    career: u.career,
});

const stripPath = (rawUrl: string | undefined): string => {
    const url = rawUrl || '';
    const noOrigin = url.replace(/^https?:\/\/[^/]+/, '');
    const noApi = noOrigin.replace(/^\/api/, '');
    const noQuery = noApi.split('?')[0];
    return noQuery || '/';
};

const parseBody = (data: unknown): any => {
    if (data == null) return {};
    if (typeof data === 'string') {
        try { return JSON.parse(data); } catch { return {}; }
    }
    return data;
};

const ok = (
    config: InternalAxiosRequestConfig,
    data: unknown,
    status = 200,
): AxiosResponse => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Created',
    headers: {},
    config,
    request: {},
});

const fail = (
    config: InternalAxiosRequestConfig,
    status: number,
    message: string,
) => {
    const response: AxiosResponse = {
        data: { message },
        status,
        statusText: 'Error',
        headers: {},
        config,
        request: {},
    };
    const error: any = new Error(message);
    error.isAxiosError = true;
    error.config = config;
    error.response = response;
    return Promise.reject(error);
};

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

// Minimal valid PDF placeholder shown when previewing a syllabus.
const fakePdfBlob = (text: string): Blob => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Vista previa (mock)</title>
<style>body{font-family:system-ui;padding:48px;background:#fef9c3;color:#000}h1{font-size:32px;margin:0 0 8px}
.box{border:3px solid #000;padding:24px;box-shadow:6px 6px 0 #000;background:#fff;max-width:640px}</style></head>
<body><div class="box"><h1>SYGSY · Vista previa</h1>
<p><strong>Modo demo:</strong> el backend está mockeado, por lo que no se genera un PDF real.</p>
<p>${text}</p></div></body></html>`;
    return new Blob([html], { type: 'text/html' });
};

// ============================================================
// Route handlers
// ============================================================

async function handle(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    await delay();
    const method = (config.method || 'get').toLowerCase();
    const path = stripPath(config.url);
    const body = parseBody(config.data);
    const params = (config.params || {}) as Record<string, any>;

    // ----- AUTH -----
    if (path === '/auth/login' && method === 'post') {
        const { username, password } = body as LoginRequest;
        const u = users.find(x => x.username === username && x.password === password);
        if (!u) return fail(config, 400, 'Credenciales inválidas');
        const res: AuthResponse = {
            token: `mock-token-${u.id}-${Date.now()}`,
            type: 'Bearer',
            id: u.id,
            username: u.username,
            fullName: u.fullName,
            role: u.role,
            career: u.career,
        };
        return ok(config, res);
    }

    if (path === '/auth/register' && method === 'post') {
        const data = body as { username: string; password: string; fullName: string; role: string; career?: string | null };
        if (users.some(u => u.username === data.username)) {
            return fail(config, 409, 'El usuario ya existe');
        }
        const newUser: MockUser = {
            id: nextUserId++,
            username: data.username,
            email: data.username,
            password: data.password,
            fullName: data.fullName,
            role: data.role as 'COORDINATOR' | 'PROFESSOR',
            career: data.career || undefined,
        };
        users.push(newUser);
        return ok(config, toPublicUser(newUser), 201);
    }

    // ----- USERS -----
    if (path === '/users' && method === 'get') {
        return ok(config, users.map(toPublicUser));
    }
    if (path === '/users/professors' && method === 'get') {
        return ok(config, users.filter(u => u.role === 'PROFESSOR').map(toPublicUser));
    }
    const userIdMatch = path.match(/^\/users\/(\d+)$/);
    if (userIdMatch && method === 'put') {
        const id = Number(userIdMatch[1]);
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return fail(config, 404, 'Usuario no encontrado');
        users[idx] = { ...users[idx], ...(body as Partial<MockUser>) };
        return ok(config, toPublicUser(users[idx]));
    }

    // ----- CAREERS -----
    if (path === '/careers' && method === 'get') {
        return ok(config, careers);
    }
    if (path === '/careers' && method === 'post') {
        const name = (body as { name: string }).name;
        const c: Career = { id: nextCareerId++, name };
        careers.push(c);
        return ok(config, c, 201);
    }
    const careerIdMatch = path.match(/^\/careers\/(\d+)$/);
    if (careerIdMatch && method === 'delete') {
        const id = Number(careerIdMatch[1]);
        const idx = careers.findIndex(c => c.id === id);
        if (idx === -1) return fail(config, 404, 'Carrera no encontrada');
        careers.splice(idx, 1);
        return ok(config, null, 200);
    }

    // ----- PERIODS -----
    if (path === '/academic-periods' && method === 'get') {
        return ok(config, periods);
    }
    if (path === '/academic-periods' && method === 'post') {
        const p = body as AcademicPeriod;
        const created: AcademicPeriod = {
            id: nextPeriodId++,
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
        };
        periods.push(created);
        return ok(config, created, 201);
    }

    // ----- SYLLABI -----
    if (path === '/syllabi' && method === 'get') {
        return ok(config, syllabi);
    }
    if (path === '/syllabi' && method === 'post') {
        const dto = body as CreateSyllabusDTO;
        const prof = users.find(u => u.username === dto.professorEmail);
        const period = periods.find(p => p.id === dto.academicPeriodId);
        const newSyl: Syllabus = {
            id: nextSyllabusId++,
            courseName: dto.courseName,
            courseCode: dto.courseCode,
            career: dto.career || prof?.career || '',
            semester: '—',
            credits: 0,
            theoryHours: 0,
            practiceHours: 0,
            faculty: 'Facultad de Ingeniería',
            trainingArea: '',
            courseType: '',
            prerequisites: '',
            professorId: prof?.id || 0,
            status: 'ACTIVE',
            workflowStatus: 'CREATED',
            academicPeriod: period ? { id: period.id, name: period.name } : undefined,
            professor: prof ? { fullName: prof.fullName, email: prof.username } : undefined,
            units: buildUnits(),
            evaluations: buildEvaluations(),
        };
        syllabi.push(newSyl);
        return ok(config, newSyl, 201);
    }
    if (path === '/syllabi/upload-bulk' && method === 'post') {
        // Simula 2 sílabos cargados desde Excel
        const periodId = Number(params.academicPeriodId) || periods[0]?.id;
        const period = periods.find(p => p.id === periodId);
        const sample: Syllabus[] = [1, 2].map(n => ({
            id: nextSyllabusId++,
            courseName: `Curso Masivo ${n}`,
            courseCode: `BULK${n}0${n}`,
            career: 'Ingeniería de Software',
            semester: '—',
            credits: 3,
            theoryHours: 2,
            practiceHours: 2,
            faculty: 'Facultad de Ingeniería',
            trainingArea: 'Específica',
            courseType: 'Obligatorio',
            prerequisites: '',
            professorId: 3,
            status: 'ACTIVE',
            workflowStatus: 'CREATED' as SyllabusStatus,
            academicPeriod: period ? { id: period.id, name: period.name } : undefined,
            units: buildUnits(),
            evaluations: buildEvaluations(),
        }));
        syllabi.push(...sample);
        return ok(config, sample, 201);
    }
    const sylIdMatch = path.match(/^\/syllabi\/(\d+)$/);
    if (sylIdMatch) {
        const id = Number(sylIdMatch[1]);
        const idx = syllabi.findIndex(s => s.id === id);
        if (idx === -1) return fail(config, 404, 'Sílabo no encontrado');
        if (method === 'get') return ok(config, syllabi[idx]);
        if (method === 'put') {
            syllabi[idx] = { ...syllabi[idx], ...(body as Syllabus), id: syllabi[idx].id };
            return ok(config, syllabi[idx]);
        }
        if (method === 'delete') {
            syllabi.splice(idx, 1);
            return ok(config, null);
        }
    }
    const sylStatusMatch = path.match(/^\/syllabi\/(\d+)\/status$/);
    if (sylStatusMatch && method === 'post') {
        const id = Number(sylStatusMatch[1]);
        const idx = syllabi.findIndex(s => s.id === id);
        if (idx === -1) return fail(config, 404, 'Sílabo no encontrado');
        const newStatus = params.status as SyllabusStatus | undefined;
        if (!newStatus) return fail(config, 400, 'Falta status');
        syllabi[idx] = { ...syllabi[idx], workflowStatus: newStatus };
        return ok(config, syllabi[idx]);
    }
    const sylPdfMatch = path.match(/^\/syllabi\/(\d+)\/pdf$/);
    if (sylPdfMatch && method === 'get') {
        const id = Number(sylPdfMatch[1]);
        const syl = syllabi.find(s => s.id === id);
        const blob = fakePdfBlob(`Sílabo: ${syl?.courseName || 'No encontrado'} (${syl?.courseCode || '---'})`);
        return ok(config, blob);
    }
    const sylUploadMatch = path.match(/^\/syllabi\/(\d+)\/upload-excel$/);
    if (sylUploadMatch && method === 'post') {
        const id = Number(sylUploadMatch[1]);
        const idx = syllabi.findIndex(s => s.id === id);
        if (idx === -1) return fail(config, 404, 'Sílabo no encontrado');
        // Simula que se procesó el Excel y se rellenaron algunos campos
        syllabi[idx] = {
            ...syllabi[idx],
            courseName: syllabi[idx].courseName.startsWith('Procesando')
                ? 'Curso importado desde Excel'
                : syllabi[idx].courseName,
            sumilla: syllabi[idx].sumilla || 'Sumilla cargada desde plantilla Excel (mock).',
        };
        return ok(config, syllabi[idx]);
    }

    // ----- Default 404 -----
    console.warn(`[MOCK] Ruta sin manejar: ${method.toUpperCase()} ${path}`);
    return fail(config, 404, `Mock no implementado: ${method.toUpperCase()} ${path}`);
}

// ============================================================
// Public exports
// ============================================================

export const mockAdapter: AxiosAdapter = (config) => {
    // Axios envía headers como AxiosHeaders; nos aseguramos de devolver tipos válidos.
    if (!config.headers) config.headers = new AxiosHeaders();
    return handle(config);
};

export const mockCredentials = [
    { label: 'Administrador', username: 'admin@ulasalle.edu.pe', password: 'admin123' },
    { label: 'Coordinador (Ing. de Software)', username: 'coord@ulasalle.edu.pe', password: '123' },
    { label: 'Docente', username: 'prof@ulasalle.edu.pe', password: '123' },
] as const;
