export const exportToCSV = (filename, headers, dataRows) => {
  // Combine headers and escape double quotes in content cells
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
    ...dataRows.map(row => 
      row.map(cell => {
        const value = cell === null || cell === undefined ? "" : cell;
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  // Create a Blob containing the CSV data and trigger browser download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
