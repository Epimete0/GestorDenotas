// frontend/src/pages/Calendar.tsx
import { useState } from "react";
import "./Calendar.css";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Eventos de ejemplo para ilustración
const sampleEvents: Record<number, { color?: string; count?: number }[]> = {
  2: [{ color: "#f44336" }, { color: "#2196f3" }, { color: "#ffeb3b" }],
  6: [{ color: "#4caf50" }, { color: "#9c27b0" }],
  15: [
    { color: "#673ab7" },
    { color: "#e91e63" },
    { color: "#03a9f4" },
    { count: 7 },
  ],
};

export default function Calendar() {
  // Estado: mes y año actuales
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());

  // Calcula días en mes y desplazamiento del primer día
  const díasEnMes = new Date(anio, mes + 1, 0).getDate();
  const primerDiaIndex = (new Date(anio, mes, 1).getDay() + 6) % 7;

  // Construir celdas: vacías + números + vacías finales
  const celdas: (number | null)[] = [];
  for (let i = 0; i < primerDiaIndex; i++) celdas.push(null);
  for (let d = 1; d <= díasEnMes; d++) celdas.push(d);
  while (celdas.length < 42) celdas.push(null);

  // Funciones para navegar meses
  const prevMes = () => {
    if (mes === 0) {
      setMes(11);
      setAnio(anio - 1);
    } else {
      setMes(mes - 1);
    }
  };
  const nextMes = () => {
    if (mes === 11) {
      setMes(0);
      setAnio(anio + 1);
    } else {
      setMes(mes + 1);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMes} className="nav-btn">
          ‹
        </button>
        <div className="calendar-title">
          {meses[mes]} {anio} <span className="dropdown">▼</span>
        </div>
        <button onClick={nextMes} className="nav-btn">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {diasSemana.map((dia) => (
          <div key={dia} className="day-name">
            {dia}
          </div>
        ))}

        {celdas.map((day, idx) => (
          <div
            key={idx}
            className={`day-cell ${
              day === new Date().getDate() &&
              mes === new Date().getMonth() &&
              anio === new Date().getFullYear()
                ? "today"
                : ""
            }`}
          >
            {day && <div className="day-number">{day}</div>}
            {day && sampleEvents[day] && (
              <div className="event-dots">
                {sampleEvents[day].map((ev, i) =>
                  ev.count ? (
                    <span key={i} className="event-more">
                      +{ev.count}
                    </span>
                  ) : (
                    <span
                      key={i}
                      className="event-dot"
                      style={{ backgroundColor: ev.color }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
