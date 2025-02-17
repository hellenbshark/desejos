'use client';
import { useEffect, useState } from 'react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/audit?table=categories')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Erro ao buscar logs:', err));
  }, []);

  return (
    <div>
      <h2>Log de Auditoria</h2>
      <table>
        <thead>
          <tr>
            <th>Operação</th>
            <th>ID do Registro</th>
            <th>Valor Antigo</th>
            <th>Valor Novo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td>{log.operation}</td>
              <td>{log.record_id}</td>
              <td>{JSON.stringify(log.old_value)}</td>
              <td>{JSON.stringify(log.new_value)}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 