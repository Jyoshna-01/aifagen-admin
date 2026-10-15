
export default function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? rows.map((row, index) => (
            <tr key={row.id ?? index}>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="empty">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
