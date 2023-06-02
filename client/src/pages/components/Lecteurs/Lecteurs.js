import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
// material-ui
import {
    Box,
    Grid,
    Stack,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Collapse,
    TextField,
    TablePagination,
    InputAdornment,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Switch,
    Avatar,
    Divider,
    FormControlLabel,
    TableSortLabel,
    Chip,
    CircularProgress,
    Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Search, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortes } from 'store/reducers/porte/porteSlice';
import { deleteLecteur, editLecteur, fetchLecteurs, insertLecteur } from 'store/reducers/lecteur/lecteurSlice';
import { useEffect } from 'react';
const API = process.env.REACT_APP_API_URL;

const DeleteIcon = styled.a`
    padding: 4px 3px;
    border-radius: 4px;
    &:hover {
    background-color: #ffcdd2
    ;
`;
const EditIcon = styled.a`
    padding: 4px 3px;
    border-radius: 4px;
    &:hover {
    background-color: #bbdefb
    ;
`;

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'id',
        align: 'left',
        disablePadding: false,
        label: '#'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Nom'
    },
    {
        id: 'ip',
        align: 'left',
        disablePadding: true,
        label: 'Adresse IP'
    },
    {
        id: 'Porte',
        align: 'left',
        disablePadding: false,
        label: 'Porte'
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Actions'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

function EnhancedTableHead(props) {
    const theme = useTheme();
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow bgcolor={theme.palette.secondary.lighter} style={{ borderBottom: '2px solid #d9d9d9' }}>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};
// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'error';
            title = 'Desactivé';
            break;
        case 1:
            color = 'success';
            title = 'Activé';
            break;
        default:
            color = 'primary';
            title = status;
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={title} color={color} />
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// console.log('rows', rows);
const Lecteurs = () => {
    const dispatch = useDispatch();
    const { records: Portes } = useSelector((state) => state.portes);
    const { records, loading, error, record } = useSelector((state) => state.lecteurs);
    useEffect(() => {
        dispatch(fetchPortes());
        dispatch(fetchLecteurs());
    }, [dispatch]);
    const rows = records;
    // console.log(rows);
    // do {} while (isLoading);

    // while (!isLoading) {}

    const theme = useTheme();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rowsLength, setRowsLength] = useState(rows.length);
    const [searchCount, setSearchCount] = useState();
    const [base64URL, setBase64URL] = useState('');
    const [toBeDeleted, setToBeDeleted] = useState();
    const [updateValues, setUpdateValues] = React.useState({});
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const InitialRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, records]
    );

    const [visibleRows, setvisibleRows] = useState(InitialRows);
    React.useMemo(
        () => setvisibleRows(stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)),
        [order, orderBy, page, rowsPerPage, records]
    );

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const requestSearch = (searchedVal) => {
        if (searchedVal === '') {
            setvisibleRows(InitialRows);
            setRowsLength(rows.length);
            setSearchCount(undefined);
            return;
        }
        const filteredRows = rows.filter((row) => {
            return (
                row.nom.toLowerCase().includes(searchedVal.toLowerCase()) || row.porte.nom.toLowerCase().includes(searchedVal.toLowerCase())
            );
        });
        // setvisibleRows(stableSort(filteredRows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        setvisibleRows(filteredRows);
        setRowsLength(filteredRows.length);
        setSearchCount(filteredRows.length);
    };

    const handleClickOpen = (row) => {
        setUpdateValues(row);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setUpdateValues({});
        setOpenDialog(false);
    };

    const handleDeleteOpen = (row) => {
        setToBeDeleted(row);
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    const handleDeleteRow = () => {
        dispatch(deleteLecteur(toBeDeleted.id));
        handleDeleteClose();
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: updateValues,
        onSubmit: (values, actions) => {
            const status = document.getElementById('status').checked;
            values = {
                id: values.id || null,
                nom: values.nom,
                porte_id: values.porte.id,
                ip: values.ip,
                serie: values.serie,
                status: status
            };
            console.log(values);
            values.id ? dispatch(editLecteur(values)) : dispatch(insertLecteur(values));
            dispatch(fetchLecteurs());
            handleClose();
            try {
            } catch (error) {
                setError(error.response.data);
            }
        },
        validationSchema: yup.object({
            nom: yup.string().max(50, 'Trop Long').required('Le nom est requis')
        })
    });
    return (
        <MainCard>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TextField
                        label="Rechercher"
                        onChange={(searchVal) => requestSearch(searchVal.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                    {searchCount ? (
                        <Typography variant="subtitle1" color="textSecondary" fontWeight="normal">
                            ({searchCount} trouvés)
                        </Typography>
                    ) : null}
                </Stack>
                <Button variant="contained" startIcon={<Add />} onClick={handleClickOpen}>
                    Ajouter
                </Button>
                <Dialog
                    open={openDelete}
                    onClose={handleDeleteClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ p: 1, py: 1.5 }}>
                        <DialogTitle id="alert-dialog-title">Voulez vous supprimez cet Porte?</DialogTitle>
                        <DialogActions>
                            <Button color="secondary" onClick={handleDeleteClose}>
                                Annuler
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDeleteRow}>
                                Supprimer
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
                <Dialog open={openDialog} onClose={handleClose} aria-labelledby="title">
                    <Box sx={{ p: 1, py: 1.5 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <DialogContent>
                                <FormControl className="formControl" fullwidth>
                                    <input id="idUpdate" name="idU" hidden value={formik.values.id} />
                                    <Box className="form">
                                        <Stack>
                                            <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                Nom:
                                            </FormLabel>
                                            <TextField
                                                id="nom"
                                                name="nom"
                                                type="text"
                                                placeholder="Enter le nom"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.nom}
                                                error={formik.errors.nom}
                                                helperText={formik.errors.nom}
                                            />
                                        </Stack>
                                        <Stack>
                                            <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                Adresse IP:
                                            </FormLabel>
                                            <TextField
                                                id="ip"
                                                name="ip"
                                                placeholder="Enter l'adresse IP"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.ip}
                                                error={formik.errors.ip}
                                                helperText={formik.errors.ip}
                                                inputProps={{
                                                    pattern:
                                                        '^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$',
                                                    title: 'Please enter a valid IP address'
                                                }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                Serie:
                                            </FormLabel>
                                            <TextField
                                                id="serie"
                                                name="serie"
                                                type="text"
                                                placeholder="Enter la serie"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.serie}
                                                error={formik.errors.serie}
                                                helperText={formik.errors.serie}
                                            />
                                        </Stack>
                                        <Stack>
                                            <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                Porte:
                                            </FormLabel>
                                            <Autocomplete
                                                disablePortal
                                                name="porte"
                                                options={Portes}
                                                getOptionLabel={(option) => option.nom}
                                                onChange={(e, value) => formik.setFieldValue('porte', value)}
                                                defaultValue={updateValues.porte}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} placeholder="Selectionner la Porte" />}
                                            />
                                        </Stack>

                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <FormLabel style={{ color: theme.palette.secondary.darker }}>Status:</FormLabel>
                                            <FormControlLabel
                                                control={<Switch id="status" defaultChecked={updateValues.status} />}
                                                label="Active"
                                            />
                                        </Stack>
                                    </Box>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button color="error" onClick={handleClose}>
                                    Annuler
                                </Button>
                                <Button variant="contained" type="submit">
                                    Ajouter
                                </Button>
                            </DialogActions>
                        </form>
                    </Box>
                </Dialog>
            </Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' },
                    marginTop: '1rem'
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 3
                        }
                    }}
                >
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                        <Stack direction="column" alignItems="center">
                            {loading ? <CircularProgress /> : null}
                        </Stack>

                        {visibleRows.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            {row.id}
                                        </TableCell>
                                        <TableCell>{row.nom}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{row.porte ? row.porte.nom : null}</TableCell>
                                        <TableCell align="left">
                                            <OrderStatus status={row.status} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <EditIcon>
                                                <EditOutlined
                                                    style={{ color: theme.palette.primary.main, cursor: 'pointer', fontSize: '20px' }}
                                                    onClick={() => handleClickOpen(row)}
                                                />
                                            </EditIcon>
                                            <DeleteIcon>
                                                <DeleteOutlined
                                                    style={{ color: theme.palette.error.main, cursor: 'pointer', fontSize: '20px' }}
                                                    onClick={() => {
                                                        handleDeleteOpen(row);
                                                    }}
                                                />
                                            </DeleteIcon>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rowsLength}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};

export default Lecteurs;
