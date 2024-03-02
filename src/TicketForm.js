// TicketForm.js
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, TextareaAutosize, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import "./TicketForm.css"
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
const modules = ["Chatbot", "Core", "Forms", "Onboarding", "Performance Management", "Report Builder", "Talent Acquisition", "Time Management", "Travel & Reimbursement", "Vibe", "Visual Analytics Dashboard", "Workflows",];
const subModules = [
    "Attendance", "Candidate Portal", "Career Page", "Chatbot", "Comp off", "Confirmation", "Core Setup", "Custom Workflow", "External Recruiter", "Formbuilder", "Goal Plan", "IDP", "Jobs & Workflow", "Leave", "Leave Actuarial Report", "MSF", "Offer Letter", "Offer Management", "Onboarding", "Onboarding Form", "Permission", "Position Management", "Reimbursement", "Report Builder", "Requisition", "Review & Talent Assessment", "Separation", "Travel", "Vibe", "Visual Analytics Dashboard",
];


const PopupInput = ({ open, onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(inputValue);
        setInputValue('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ maxWidth: '1000px', maxHeight: '1000px', margin: '0 auto' }}>
            <DialogTitle>Enter Resolution</DialogTitle>
            
            <DialogContent sx={{ width: '500px', height: '500px' }}>
                <textarea
                    autoFocus
                    margin="dense"
                    label="Input"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    style={{
                        height: "95%",
                        width: "95%",
                        overflow: "hidden",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                />
                </DialogContent>
                

            <DialogActions>
                <center>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
                </center>
                
            </DialogActions>
        </Dialog>
    );
};

const TicketForm = () => {
    const [ticketId, setTicketId] = useState("");
    const [module, setModule] = useState("");
    const [subModule, setSubModule] = useState("");
    const [text, setText] = useState("");
    const [results, setResults] = useState({
        resolutions: [],
        sections: [],
        contents: [],
    });
    const [likedResults, setlikedResults] = useState({
        resolutions: [],
        sections: [],
        contents: [],
    });
    const [likedIndexes, setLikedIndexes] = useState({
        resolutions: [],
        sections: [],
        contents: [],
    });
    const [dislikedResults, setDislikedResults] = useState({
        resolutions: [],
        sections: [],
        contents: [],
    });
    const [dislikedIndexes, setDislikedIndexes] = useState({
        resolutions: [],
        sections: [],
        contents: [],
    });

    const [savedResults, setSavedResults] = useState();
    const [resultsFlag, setResultsFlag] = useState(false);
    const [savedResultsFlag, setSavedResultsFlag] = useState(false);
    const [opensourceFlag, setOpensourceFlag] = useState("True");
    const [message, setMessage] = useState("");




    const [showPopup, setShowPopup] = useState(false);


    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleResolutionsSubmit = async (inputValue) => {
        // console.log('Submitted value:', inputValue);
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/save_feedback",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                    body: JSON.stringify({
                        ticket_id: ticketId,
                        question: text,
                        module: module,
                        sub_module: subModule,
                        opensource: opensourceFlag,
                        resolution: inputValue,
                        resolutions: [...likedResults.resolutions, ...dislikedResults.resolutions],
                        sections: [...likedResults.sections, ...dislikedResults.sections],
                        contents: [...likedResults.contents, ...dislikedResults.contents]
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const responseData = await response.json();
            // console.log("Response:", responseData);
            setMessage(responseData.message);
        } catch (error) {
            // console.error("Error:", error);
        }
        // Handle submission logic here
    };


    const handleOpenSource = (event, flagValue) => {
        // console.log("flagValue", flagValue);
        if (flagValue !== null) {
            setOpensourceFlag(flagValue);
        }
    };


    const handleLikedButton = (index, type) => {
        const existingIndex = likedResults[type].findIndex(item => item.similarity === results[type][index].similarity);
        console.log("rafaergf", existingIndex, likedResults)
        if (existingIndex === -1) {
            setlikedResults({
                ...likedResults,
                [type]: likedResults[type].concat({ ...results[type][index], "like": "True" }),
            });
            setLikedIndexes({
                ...likedIndexes,
                [type]: likedIndexes[type].concat(index),
            });
        } else {
            setlikedResults(prevState => ({
                ...prevState,
                [type]: prevState[type].filter((_, i) => i !== existingIndex),
            }));
            console.log("rafaergf", existingIndex)
            setLikedIndexes(prevState => ({
                ...prevState,
                [type]: prevState[type].filter(idx => idx !== existingIndex),
            }));
        }
    };

    const handleDislikedButton = (index, type) => {
        const existingIndex = dislikedResults[type].findIndex(item => item.similarity === results[type][index].similarity);
        if (existingIndex === -1) {
            setDislikedResults({
                ...dislikedResults,
                [type]: dislikedResults[type].concat({ ...results[type][index], "like": "False" }),
            });
            setDislikedIndexes({
                ...dislikedIndexes,
                [type]: dislikedIndexes[type].concat(index),
            });
        } else {
            setDislikedResults(prevState => ({
                ...prevState,
                [type]: prevState[type].filter((_, i) => i !== existingIndex),
            }));
            setDislikedIndexes(prevState => ({
                ...prevState,
                [type]: prevState[type].filter((_, i) => i !== existingIndex),
            }
            ));
        }
    };

    const handleTicketIdChange = (e) => {
        setTicketId(e.target.value);
        // console.log(ticketId);
        if (ticketId === null || ticketId === "") {
            setModule("");
            setSubModule("");
            setText("");
        } else {
        }
    };

    const handleSaveLikedData = async () => {
        // console.log("likedResults", likedResults, dislikedResults);
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/save_feedback",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                    body: JSON.stringify({
                        ticket_id: ticketId,
                        question: text,
                        module: module,
                        sub_module: subModule,
                        opensource: opensourceFlag,
                        resolution: "",
                        resolutions: [...likedResults.resolutions, ...dislikedResults.resolutions],
                        sections: [...likedResults.sections, ...dislikedResults.sections],
                        contents: [...likedResults.contents, ...dislikedResults.contents]
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const responseData = await response.json();
            // console.log("Response:", responseData);
            setMessage(responseData.message);
        } catch (error) {
            // console.error("Error:", error);
        }
    };

    const handleNoResolutionsFound = async () => {
        // console.log("likedResults", likedResults);
        // setlikedResults({
        //     sections: [],
        //     resolutions: [],
        //     contents: [],
        // });
        // setDislikedResults({
        //     sections: [],
        //     resolutions: [],
        //     contents: [],
        // });
        setShowPopup(true);

    };

    const handleSubmit = () => {
        setMessage("");
        const getProblemStatement = async (requestData) => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/get_problem_statement",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "application/json",
                        },
                        body: JSON.stringify(requestData),
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const responseData = await response.json();

                return responseData;
            } catch (error) {
                // console.error("Error:", error);
                throw error;
            }
        };
        const get_feedback = async (ticketid) => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/get_feedback/" +
                    ticketid,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const responseData = await response.json();
                // console.log("fwefwefwefefefwfwefw responseData", responseData);
                return responseData;
            } catch (error) {
                // console.error("Error:", error);
                throw error;
            }
        };
        const requestData = {
            ticket_id: ticketId,
            question: text,
            module: module,
            sub_module: subModule,
            opensource: opensourceFlag,
        };
        if (text === "" || text === null) {
            get_feedback(ticketId)
                .then((responseData) => {
                    // console.log("Response:", responseData);
                    setSavedResults(responseData);
                    setResultsFlag(false);
                    setSavedResultsFlag(true);
                })
                .catch((error) => {
                    // console.error("Error:", error);
                });
            // console.log("Form data:", { ticketId, module, subModule, text });
        } else {
            getProblemStatement(requestData)
                .then((responseData) => {
                    // console.log("Response:", responseData);
                    setResults(responseData);
                    setResultsFlag(true);
                    setSavedResultsFlag(false);
                })
                .catch((error) => {
                    // console.error("Error:", error);
                });
            // console.log("Form data:", { ticketId, module, subModule, text });
        }
    };

    return (
        <>
            <div
                style={{
                    height: "70px",
                    borderBottom: "1px solid #ccc",
                    background: "#3a6ca3db",
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
                <center></center>
                <h1 style={{ margin: "0" }}>AI Knowledge Base</h1>
                <br></br>
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
                        onChange={(e) => {
                            handleTicketIdChange(e);
                        }}
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
                </form>
                {(resultsFlag || savedResultsFlag) ? (
                    <div>
                        <div>
                            {resultsFlag ? (
                                <></>
                            ) : (
                                <>
                                    <Grid container spacing={2}>
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
                                    {(savedResults.resolution)&&(
                                        <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <h4>Resolution:</h4>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <p>{savedResults.resolution}</p>
                                        </Grid>
                                    </Grid>
                                    )}
                                </>
                            )}

                            <h2>Resolution Data</h2>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Historical Problem Statement</TableCell>
                                            <TableCell>Resolution</TableCell>
                                            <TableCell>Similarity</TableCell>
                                            <TableCell>Feedback</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {resultsFlag ? (
                                            <>
                                                {results.resolutions.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.historical_problem_statement}
                                                        </TableCell>
                                                        <TableCell>{item.resolutions}</TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Like">
                                                                <IconButton
                                                                    onClick={() => handleLikedButton(index, 'resolutions')}
                                                                    style={{ color: likedIndexes.resolutions.includes(index) ? 'blue' : 'inherit' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Dislike">
                                                                <IconButton onClick={() => handleDislikedButton(index, 'resolutions')}
                                                                    style={{ color: dislikedIndexes.resolutions.includes(index) ? 'red' : 'inherit' }}
                                                                >
                                                                    <ThumbDownIcon />
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
                                                        <TableCell>
                                                            {item.historical_problem_statement}
                                                        </TableCell>
                                                        <TableCell>{item.resolutions}</TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            {(item.like === "True") && (<Tooltip title="Like">
                                                                <IconButton
                                                                    style={{ color: 'blue' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                            {(item.like === "False") && (<Tooltip title="Dislike">
                                                                <IconButton
                                                                    style={{ color: 'red' }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                        </TableCell>
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
                                            <TableCell>Feedback</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {resultsFlag ? (
                                            <>
                                                {results.sections.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.section}</TableCell>
                                                        <TableCell>{item.heading}</TableCell>
                                                        <TableCell>{item.file}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    height: "100px",
                                                                    width: "250px",
                                                                    overflowY: "scroll",
                                                                    overflowX: "hidden",
                                                                    textA: "justify",
                                                                    padding: "20px",
                                                                }}
                                                            >
                                                                {item.contents}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Like">
                                                                <IconButton
                                                                    onClick={() => handleLikedButton(index, 'sections')}
                                                                    style={{ color: likedIndexes.sections.includes(index) ? 'blue' : 'inherit' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Dislike">
                                                                <IconButton onClick={() => handleDislikedButton(index, 'sections')}
                                                                    style={{ color: dislikedIndexes.sections.includes(index) ? 'red' : 'inherit' }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {savedResults.sections.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.section}</TableCell>
                                                        <TableCell>{item.heading}</TableCell>
                                                        <TableCell>{item.file}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    height: "100px",
                                                                    width: "250px",
                                                                    overflowY: "scroll",
                                                                    overflowX: "hidden",
                                                                    textA: "justify",
                                                                    padding: "20px",
                                                                }}
                                                            >
                                                                {item.contents}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            {(item.like === "True") && (<Tooltip title="Like">
                                                                <IconButton
                                                                    style={{ color: 'blue' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                            {(item.like === "False") && (<Tooltip title="Dislike">
                                                                <IconButton
                                                                    style={{ color: 'red' }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                        </TableCell>
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
                                            <TableCell>Feedback</TableCell>
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
                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    height: "100px",
                                                                    width: "250px",
                                                                    overflowY: "scroll",
                                                                    overflowX: "hidden",
                                                                    textA: "justify",
                                                                    padding: "20px",
                                                                }}
                                                            >
                                                                {item.contents}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Like">
                                                                <IconButton
                                                                    onClick={() => handleLikedButton(index, 'contents')}
                                                                    style={{ color: likedIndexes.contents.includes(index) ? 'blue' : 'inherit' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Dislike">
                                                                <IconButton onClick={() => handleDislikedButton(index, 'contents')}
                                                                    style={{ color: dislikedIndexes.contents.includes(index) ? 'red' : 'inherit' }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {savedResults.contents.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.section}</TableCell>
                                                        <TableCell>{item.heading}</TableCell>
                                                        <TableCell>{item.file}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    height: "100px",
                                                                    width: "250px",
                                                                    overflowY: "scroll",
                                                                    overflowX: "hidden",
                                                                    textA: "justify",
                                                                    padding: "20px",
                                                                }}
                                                            >
                                                                {item.contents}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.similarity}</TableCell>
                                                        <TableCell>
                                                            {(item.like === "True") && (<Tooltip title="Like">
                                                                <IconButton
                                                                    style={{ color: 'blue' }}
                                                                >
                                                                    <ThumbUpIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                            {(item.like === "False") && (<Tooltip title="Dislike">
                                                                <IconButton
                                                                    style={{ color: 'red' }}
                                                                >
                                                                    <ThumbDownIcon />
                                                                </IconButton>
                                                            </Tooltip>)}
                                                        </TableCell>
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
                            {resultsFlag ? (<>
                                <center>
                                    <span style={{ marginRight: "10px" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSaveLikedData()}
                                        >
                                            Save
                                        </Button>
                                    </span>

                                    <span>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => handleNoResolutionsFound()}
                                        >
                                            Enter Resolution
                                        </Button>
                                        <PopupInput open={showPopup} onClose={handleClosePopup} onSubmit={handleResolutionsSubmit} />
                                    </span>
                                </center><br></br>
                                <center>
                                    <span style={{ color: "green" }}>
                                        <b>{message}</b>
                                    </span>
                                </center>
                            </>) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (<></>)}

            </div>
        </>
    );
};

export default TicketForm;