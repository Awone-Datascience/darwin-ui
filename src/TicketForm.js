// TicketForm.js
import React, { useState } from "react";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextareaAutosize,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Grid,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
const modules = [
    "Chatbot",
    "Core",
    "Forms",
    "Onboarding",
    "Performance Management",
    "Report Builder",
    "Talent Acquisition",
    "Time Management",
    "Travel & Reimbursement",
    "Vibe",
    "Visual Analytics Dashboard",
    "Workflows",
];
const subModules = [
    "Attendance",
    "Candidate Portal",
    "Career Page",
    "Chatbot",
    "Comp off",
    "Confirmation",
    "Core Setup",
    "Custom Workflow",
    "External Recruiter",
    "Formbuilder",
    "Goal Plan",
    "IDP",
    "Jobs & Workflow",
    "Leave",
    "Leave Actuarial Report",
    "MSF",
    "Offer Letter",
    "Offer Management",
    "Onboarding",
    "Onboarding Form",
    "Permission",
    "Position Management",
    "Reimbursement",
    "Report Builder",
    "Requisition",
    "Review & Talent Assessment",
    "Separation",
    "Travel",
    "Vibe",
    "Visual Analytics Dashboard",
];

const TicketForm = () => {
    const [ticketId, setTicketId] = useState("");
    const [module, setModule] = useState("");
    const [subModule, setSubModule] = useState("");
    const [text, setText] = useState("");
    const [results, setResults] = useState({ resolutions: [], sections: [], contents: [] });
    const [likedResults, setlikedResults] = useState({ resolutions: [], sections: [], contents: [] });
    const [savedResults, setSavedResults] = useState({});
    const [resultsFlag, setResultsFlag] = useState(true);
    const [opensourceFlag, setOpensourceFlag] = useState("True");
    const [message, setMessage] = useState("");
    const handleLikedResolution = (index) => {
        console.log("Liked resolution:", results.resolutions[index]);
        setlikedResults({
            ...likedResults,
            resolutions: likedResults.resolutions.concat(results.resolutions[index])
        });
    };

    const handleLikedContents = (index) => {
        console.log("Liked contents:", results.contents[index]);
        setlikedResults({
            ...likedResults,
            contents: likedResults.contents.concat(results.contents[index])
        });
    };

    const handleOpenSource = (event, flagValue) => {
        console.log("flagValue", flagValue)
        if (flagValue !== null) {
            setOpensourceFlag(flagValue);
        }
    };


    const handleLikedSection = (index) => {
        console.log("Liked Section:", results.sections[index]);
        setlikedResults({
            ...likedResults,
            sections: likedResults.sections.concat(results.sections[index])
        });
    };
    const handleTicketIdChange = (e) => {
        setTicketId(e.target.value);
        console.log(ticketId)
        if (ticketId === null || ticketId === "") {
            
            setModule("")
            setSubModule("")
            setText("")
        } else {
            
        }
    }

    const handleSaveLikedData = async () => {
        console.log("likedResults", likedResults)
        try {
            const response = await fetch('http://localhost:8000/save_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    question: text,
                    module: module,
                    sub_module: subModule,
                    opensource: opensourceFlag,
                    resolutions: likedResults.resolutions,
                    sections: likedResults.sections,
                    contents: likedResults.contents
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response:', responseData);
            setMessage(responseData.message)
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleNoResolutionsFound = async () => {
        console.log("likedResults", likedResults)
        setlikedResults({
            sections: [],
            resolutions: []
        });
        try {
            const response = await fetch('http://localhost:8000/save_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    question: text,
                    module: module,
                    sub_module: subModule,
                    opensource: opensourceFlag,
                    resolutions: likedResults.resolutions,
                    sections: likedResults.sections,
                    contents: likedResults.contents
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response:', responseData);
            setMessage(responseData.message)
        } catch (error) {
            console.error('Error:', error);
        }
    }



    const handleSubmit = () => {
        setMessage("")
        const getProblemStatement = async (requestData) => {
            try {
                const response = await fetch('http://localhost:8000/get_problem_statement', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();

                return responseData;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        };
        const get_feedback = async (ticketid) => {
            try {
                const response = await fetch('http://localhost:8000/get_feedback/' + ticketid+"", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                console.log("fwefwefwefefefwfwefw responseData", responseData)
                return responseData;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        };
        const requestData = {
            ticket_id: ticketId,
            question: text,
            module: module,
            sub_module: subModule,
            opensource: opensourceFlag
        };
        if (text==="" || text===null) {
            console.log("fibhjarwfkhjarlfb baawlkjfbnwaljk")
            get_feedback(ticketId)
                .then((responseData) => {
                    console.log('Response:', responseData);
                    setSavedResults(responseData)
                    setResultsFlag(false)
                    // setResults(responseData)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            console.log("Form data:", { ticketId, module, subModule, text });
        } else {
            getProblemStatement(requestData)
                .then((responseData) => {
                    console.log('Response:', responseData);
                    setResults(responseData)
                    setResultsFlag(true)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            console.log("Form data:", { ticketId, module, subModule, text });
        }
    };

    return (
        <>
            <div
                style={{
                    height: "70px",
                    borderBottom: "1px solid #ccc",
                    background: '#3a6ca3db'
                }}
            ></div>
            <div
                style={{
                    width: "60%",
                    margin: "20px auto",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    background: "#fff",
                }}
            >
                <center>
                </center>
                <h1 style={{ margin: "0" }}>AI Knowledge Base</h1><br></br>
                <form>
                    <FormControl component="fieldset">
                        <ToggleButtonGroup
                            value={opensourceFlag}
                            exclusive
                            onChange={handleOpenSource}
                        >
                            <ToggleButton value="True" aria-label="left aligned">
                                Open Source
                            </ToggleButton>
                            <ToggleButton value="False" aria-label="right aligned">
                                Open AI
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>
                    <TextField
                        label="Ticket ID"
                        value={ticketId}
                        onChange={(e) => { handleTicketIdChange(e) }}
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
                        <Select
                            value={subModule}
                            onChange={(e) => setSubModule(e.target.value)}
                        >
                            {subModules.map((subModuleOption) => (
                                <MenuItem key={subModuleOption} value={subModuleOption}>
                                    {subModuleOption}
                                </MenuItem>
                            ))}
                        </Select>
                        <br />
                        <TextareaAutosize
                            aria-label="Problem Statement"
                            placeholder="Problem Statement"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                height: "100px",
                                overflow: "hidden",
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "5px",
                            }}
                        />
                    </FormControl>


                    <br></br>
                    <center>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </center>

                    {/* <label>Result:</label>
                    <p style={{
                        padding: "5px",
                        border: "1px solid #ccc",
                        width: "fit-content",
                    }}>{result}</p> */}



                </form>
                <div>
                    <div>
                        {resultsFlag ? (
                            <></>
                        ) : (<>

                            <Grid container spacing={2} >
                                <Grid item xs={2}>
                                    <h4>Ticket ID:</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>{savedResults.ticket_id}</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <h4>Problem Statement:</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>{savedResults.question}</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <h4>Module:</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>{savedResults.module}</p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <h4>SubModule:</h4>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>{savedResults.sub_module}</p>
                                </Grid>
                            </Grid>


                        </>)}

                        <h2>Resolution Data</h2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Historical Problem Statement</TableCell>
                                        <TableCell>Resolution</TableCell>
                                        <TableCell>Similarity</TableCell>
                                        {resultsFlag ? (
                                            <><TableCell>Feedback</TableCell></>) : ('')}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultsFlag ? (
                                        <>
                                            {results.resolutions.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.historical_problem_statement}</TableCell>
                                                    <TableCell>{item.resolutions}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Like">
                                                            <IconButton onClick={() => handleLikedResolution(index)}>
                                                                <ThumbUpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {savedResults.resolutions.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.historical_problem_statement}</TableCell>
                                                    <TableCell>{item.resolutions}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <br></br>
                    <div>
                        <h2>Section Data</h2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Section</TableCell>
                                        <TableCell>Heading</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Contents</TableCell>
                                        <TableCell>Similarity</TableCell>
                                        {resultsFlag ? (
                                            <><TableCell>Feedback</TableCell></>) : ('')}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultsFlag ? (
                                        <>
                                            {results.sections.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell >{item.section}</TableCell>
                                                    <TableCell>{item.heading}</TableCell>
                                                    <TableCell>{item.file}</TableCell>
                                                    <TableCell sx={{height:"400px",overflow:"scroll"}}>{item.contents}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Like">
                                                            <IconButton onClick={() => handleLikedSection(index)}>
                                                                <ThumbUpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}</>
                                    ) : (
                                        <>
                                            {savedResults.sections.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.section}</TableCell>
                                                    <TableCell>{item.heading}</TableCell>
                                                    <TableCell>{item.file}</TableCell>
                                                    <TableCell sx={{height:"400px",overflow:"scroll"}}>{item.contents}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                </TableRow>
                                            ))}</>
                                    )

                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <br></br>
                    <div>
                        <h2>Contents Data</h2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Section</TableCell>
                                        <TableCell>Heading</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Contents</TableCell>
                                        <TableCell>Similarity</TableCell>
                                        {resultsFlag ? (
                                            <><TableCell>Feedback</TableCell></>) : ('')}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultsFlag ? (
                                        <>
                                            {results.contents.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.section}</TableCell>
                                                    <TableCell>{item.heading}</TableCell>
                                                    <TableCell>{item.file}</TableCell>
                                                    <TableCell sx={{height:"400px",overflowY:"scroll"}}>{item.contents}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Like">
                                                            <IconButton onClick={() => handleLikedContents(index)}>
                                                                <ThumbUpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}</>
                                    ) : (
                                        <>
                                            {savedResults.contents.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.section}</TableCell>
                                                    <TableCell>{item.heading}</TableCell>
                                                    <TableCell>{item.file}</TableCell>
                                                    <TableCell sx={{height:"400px",overflow:"scroll"}}>{item.contents}</TableCell>
                                                    <TableCell>{item.similarity}</TableCell>
                                                </TableRow>
                                            ))}</>
                                    )

                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <br></br>
                    <center>
                        <span style={{ marginRight: '10px' }}>
                            <Button variant="contained" color="primary" onClick={() => handleSaveLikedData()}>
                                Save
                            </Button>
                        </span>

                        <span>
                            <Button variant="contained" color="warning" onClick={() => handleNoResolutionsFound()}>
                                No resolutions Found
                            </Button>
                        </span>
                    </center><br />
                    {resultsFlag ? (
                        <>
                            <center>
                                <span style={{ color: "green" }}>
                                    <b>{message}</b>
                                </span>
                            </center></>) : (<></>)}

                </div>

            </div>
        </>
    );
};

export default TicketForm;