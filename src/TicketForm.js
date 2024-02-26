// TicketForm.js
import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, TextareaAutosize } from '@mui/material';

// Predefined lists of modules and submodules
const modules = ['Chatbot', 'Core', 'Forms', 'Onboarding', 'Performance Management', 'Report Builder', 'Talent Acquisition', 'Time Management', 'Travel & Reimbursement', 'Vibe', 'Visual Analytics Dashboard', 'Workflows'];
const subModules = ['Attendance', 'Candidate Portal', 'Career Page', 'Chatbot', 'Comp off', 'Confirmation', 'Core Setup', 'Custom Workflow', 'External Recruiter', 'Formbuilder', 'Goal Plan', 'IDP', 'Jobs & Workflow', 'Leave', 'Leave Actuarial Report', 'MSF', 'Offer Letter', 'Offer Management', 'Onboarding', 'Onboarding Form', 'Permission', 'Position Management', 'Reimbursement', 'Report Builder', 'Requisition', 'Review & Talent Assessment', 'Separation', 'Travel', 'Vibe', 'Visual Analytics Dashboard'];

const TicketForm = () => {
  const [ticketId, setTicketId] = useState('');
  const [module, setModule] = useState('');
  const [subModule, setSubModule] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = () => {
    // Make API call here using the form data
    console.log('Form data:', { ticketId, module, subModule, text });
  };

  return (
    <form>
      <TextField
        label="Ticket ID (Optional)"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Module</InputLabel>
        <Select value={module} onChange={(e) => setModule(e.target.value)}>
          {modules.map((moduleOption) => (
            <MenuItem key={moduleOption} value={moduleOption}>
              {moduleOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Sub-Module</InputLabel>
        <Select value={subModule} onChange={(e) => setSubModule(e.target.value)}>
          {subModules.map((subModuleOption) => (
            <MenuItem key={subModuleOption} value={subModuleOption}>
              {subModuleOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextareaAutosize
        aria-label="Problem Statement"
        placeholder="Problem Statement"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ minHeight: '100px', width: '100%', resize: 'vertical' }} // Set a fixed minHeight and allow vertical resizing
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </form>
  );
};

export default TicketForm;
