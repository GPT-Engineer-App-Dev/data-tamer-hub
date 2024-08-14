import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CSVUploader from './CSVUploader';
import EditableRow from './EditableRow';

const CSVEditor = () => {
  const [headers, setHeaders] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const queryClient = useQueryClient();

  const { data: csvData, isLoading, isError } = useQuery({
    queryKey: ['csvData'],
    queryFn: () => [], // Initially empty, will be populated when CSV is uploaded
    enabled: false,
  });

  const updateRowMutation = useMutation({
    mutationFn: (updatedRow) => {
      // In a real app, this would be an API call
      return Promise.resolve(updatedRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['csvData']);
      setEditingRow(null);
    },
  });

  const addRowMutation = useMutation({
    mutationFn: (newRow) => {
      // In a real app, this would be an API call
      return Promise.resolve(newRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['csvData']);
    },
  });

  const deleteRowMutation = useMutation({
    mutationFn: (rowIndex) => {
      // In a real app, this would be an API call
      return Promise.resolve(rowIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['csvData']);
    },
  });

  const handleFileUpload = (data, headers) => {
    setHeaders(headers);
    queryClient.setQueryData(['csvData'], data);
  };

  const handleEditRow = (index) => {
    setEditingRow(index);
  };

  const handleUpdateRow = (updatedRow) => {
    updateRowMutation.mutate(updatedRow);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
    addRowMutation.mutate(newRow);
  };

  const handleDeleteRow = (index) => {
    deleteRowMutation.mutate(index);
  };

  const handleDownload = () => {
    if (!csvData || csvData.length === 0) return;

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Editor</h1>
      <CSVUploader onUpload={handleFileUpload} />
      {csvData && csvData.length > 0 && (
        <>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                {headers.map(header => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, index) => (
                <EditableRow
                  key={index}
                  row={row}
                  headers={headers}
                  isEditing={editingRow === index}
                  onEdit={() => handleEditRow(index)}
                  onUpdate={handleUpdateRow}
                  onDelete={() => handleDeleteRow(index)}
                />
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-x-2">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CSVEditor;