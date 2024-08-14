import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditableRow = ({ row, headers, isEditing, onEdit, onUpdate, onDelete }) => {
  const [editedRow, setEditedRow] = useState(row);

  const handleInputChange = (header, value) => {
    setEditedRow(prev => ({ ...prev, [header]: value }));
  };

  const handleSave = () => {
    onUpdate(editedRow);
  };

  if (isEditing) {
    return (
      <TableRow>
        {headers.map(header => (
          <TableCell key={header}>
            <Input
              value={editedRow[header]}
              onChange={(e) => handleInputChange(header, e.target.value)}
            />
          </TableCell>
        ))}
        <TableCell>
          <Button onClick={handleSave}>Save</Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      {headers.map(header => (
        <TableCell key={header}>{row[header]}</TableCell>
      ))}
      <TableCell>
        <Button variant="outline" className="mr-2" onClick={onEdit}>Edit</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

export default EditableRow;