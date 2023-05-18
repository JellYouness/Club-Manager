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
    CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { VisibilityOutlined, CloseOutlined, Search, Add, Face4, Face6 } from '@mui/icons-material';
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
// import { deleteAdherent, fetchAdherents, insertAdherent } from 'store/reducers/adherent/adherentSlice';
import { useGetAllAdherentsQuery, usePrefetch } from 'store/reducers/apiSlice';
import { fetchAdherents } from 'store/reducers/adherent/adherentSlice';
import { useEffect } from 'react';

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

const Red = {
    color: '#ed4337',
    margin: '0 0 0.2rem 0.2rem'
};

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
        label: 'Nom & Prenom'
    },
    {
        id: 'cin',
        align: 'left',
        disablePadding: false,
        label: 'CIN/Passport'
    },
    {
        id: 'matricule',
        align: 'left',
        disablePadding: false,
        label: 'Matricule'
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
                <TableCell></TableCell>
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
        case true:
            color = 'success';
            title = 'Abonné';
            break;
        case false:
            color = 'error';
            title = 'Non abonné';
            break;
        default:
            color = 'primary';
            title = ' ';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={title} variant="light" color={color} />
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};
function createData(id, nom, prenom, cin, email, telephone, naissance, civilité, matricule, status, image, created_at, updated_at) {
    return { id, nom, prenom, cin, email, telephone, naissance, civilité, matricule, status, image, created_at, updated_at };
}

// console.log('rows', rows);
const Adherents = () => {
    const dispatch = useDispatch();
    const { records, loading, error, record } = useSelector((state) => state.adherents);
    useEffect(() => {
        dispatch(fetchAdherents());
    }, [records, loading, error, record]);

    console.log('adherents', records, loading);
    const rows = records;
    // do {} while (isLoading);

    // while (!isLoading) {}
    // console.log('data', JSON.parse(data), isLoading);

    const theme = useTheme();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(null);
    const [rowsLength, setRowsLength] = useState(rows.length);
    const [searchCount, setSearchCount] = useState();
    const [base64URL, setBase64URL] = useState('');
    const [updateValues, setUpdateValues] = React.useState({});
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const InitialRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage]
    );

    const [visibleRows, setvisibleRows] = useState(InitialRows);
    React.useMemo(
        () => setvisibleRows(stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)),
        [order, orderBy, page, rowsPerPage]
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
                row.nom.toLowerCase().includes(searchedVal.toLowerCase()) || row.prenom.toLowerCase().includes(searchedVal.toLowerCase())
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

    const handleDeleteOpen = (id) => {
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    const handleDeleteRow = (id) => {
        // dispatch(deleteAdherent(id));
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: updateValues,
        onSubmit: (values, actions) => {
            const status = document.getElementById('status').checked;
            values = {
                nom: values.nom,
                prenom: values.prenom,
                email: values.email,
                cin: values.cin,
                telephone: values.telephone,
                naissance: values.naissance,
                civilité: values.civilite,
                matricule: values.matricule,
                photo: base64URL,
                status: status
            };
            dispatch(insertAdherent(values));
            // dispatch(fetchAdherents());
            try {
            } catch (error) {
                setError(error.response.data);
            }
        },
        validationSchema: yup.object({
            nom: yup.string().max(50, 'Trop Long').required('Le nom est requis'),
            prenom: yup.string().max(50, 'Trop Long').required('Le prenom est requis'),
            email: yup.string().email('Veuillez saisir une adresse email valide').required("L'adresse email est requise"),
            cin: yup.string().max(8, 'Format incorrect').required('Le CIN est requis'),
            telephone: yup.number().required('Le telephone est requis'),
            naissance: yup
                .date()
                .min(new Date('1950-01-01'), 'Date must be after 1900')
                .max(new Date('2020-01-01'), 'Date cannot be in the future')
                .required('la date de naissance est requis'),
            civilite: yup.mixed().required('La civilité est requise'),
            matricule: yup.string().max(10, 'Format incorrect').required('Le matricule est requis')
        })
    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
                imagePreview.style.display = 'none';
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    const getBase64 = (file) => {
        return new Promise((resolve) => {
            let baseURL = '';
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };
    const handleImageChange = (event) => {
        readURL(event.target);
        let selectedFile = event.target.files[0];
        getBase64(selectedFile)
            .then((result) => {
                setBase64URL(result);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const age = (date) => {
        const today = new Date();
        const birthdate = new Date(date);
        const age =
            today.getFullYear() -
            birthdate.getFullYear() -
            (today.getMonth() < birthdate.getMonth() ||
                (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
        return age;
    };
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

                <Dialog open={openDialog} onClose={handleClose} aria-labelledby="title">
                    <Box sx={{ p: 1, py: 1.5 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <DialogContent>
                                <FormControl className="formControl" fullwidth>
                                    <Stack direction="row" spacing={6}>
                                        <div>
                                            <FormLabel style={{ color: theme.palette.secondary.darker }}>Photo:</FormLabel>
                                            <div class="avatar-upload">
                                                <div class="avatar-edit">
                                                    <input
                                                        type="file"
                                                        id="imageUpload"
                                                        accept=".png, .jpg, .jpeg"
                                                        onChange={handleImageChange}
                                                    />
                                                    <FormLabel for="imageUpload" id="label"></FormLabel>
                                                </div>
                                                <div class="avatar-preview">
                                                    <div id="imagePreview"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form">
                                            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
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
                                                    />
                                                    {formik.touched.nom && formik.errors.nom ? (
                                                        <p style={Red}>{formik.errors.nom}</p>
                                                    ) : null}
                                                </Stack>
                                                <Stack>
                                                    <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                        Prénom:
                                                    </FormLabel>
                                                    <TextField
                                                        id="prenom"
                                                        placeholder="Enter le prenom"
                                                        type="text"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.prenom}
                                                    />
                                                    {formik.touched.prenom && formik.errors.prenom ? (
                                                        <p style={Red}>{formik.errors.prenom}</p>
                                                    ) : null}
                                                </Stack>
                                            </Stack>
                                            <FormLabel style={{ color: theme.palette.secondary.darker }}>Email:</FormLabel>
                                            <TextField
                                                id="email"
                                                placeholder="example@mail.com"
                                                type="email"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                            />
                                            {formik.touched.email && formik.errors.email ? <p style={Red}>{formik.errors.email}</p> : null}
                                            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                                                <Stack>
                                                    <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                        CIN/Passport:
                                                    </FormLabel>
                                                    <TextField
                                                        id="cin"
                                                        name="cin"
                                                        placeholder="AB123456"
                                                        type="text"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.cin}
                                                    />
                                                    {formik.touched.cin && formik.errors.cin ? (
                                                        <p style={Red}>{formik.errors.cin}</p>
                                                    ) : null}
                                                </Stack>
                                                <Stack>
                                                    <FormLabel style={{ marginBottom: '0.2rem', color: theme.palette.secondary.darker }}>
                                                        Téléphone:
                                                    </FormLabel>
                                                    <TextField
                                                        id="telephone"
                                                        placeholder="0600000000"
                                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.telephone}
                                                    />
                                                    {formik.touched.telephone && formik.errors.telephone ? (
                                                        <p style={Red}>{formik.errors.telephone}</p>
                                                    ) : null}
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <FormLabel style={{ color: theme.palette.secondary.darker }}>Civilité:</FormLabel>
                                                <RadioGroup
                                                    name="civilite"
                                                    id="civilite"
                                                    row
                                                    value={formik.values.civilite ? formik.values.civilite : ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                </RadioGroup>
                                                {formik.touched.civilite && formik.errors.civilite ? (
                                                    <p style={Red}>{formik.errors.civilite}</p>
                                                ) : null}
                                            </Stack>
                                            <FormLabel style={{ color: theme.palette.secondary.darker }}>Date de naissance:</FormLabel>
                                            <TextField
                                                id="naissance"
                                                type="date"
                                                sx={{ width: 220 }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.naissance}
                                            />
                                            {formik.touched.naissance && formik.errors.naissance ? (
                                                <p style={Red}>{formik.errors.naissance}</p>
                                            ) : null}
                                            <FormLabel style={{ color: theme.palette.secondary.darker }}>Matricule:</FormLabel>
                                            <TextField
                                                id="matricule"
                                                name="matricule"
                                                placeholder="123456"
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.matricule}
                                            />
                                            {formik.touched.matricule && formik.errors.matricule ? (
                                                <p style={Red}>{formik.errors.matricule}</p>
                                            ) : null}
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <FormLabel style={{ color: theme.palette.secondary.darker }}>Status:</FormLabel>
                                                <FormControlLabel
                                                    control={<Switch id="status" checked={formik.values.status} />}
                                                    label="Active"
                                                />
                                            </Stack>
                                        </div>
                                    </Stack>
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
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => {
                                                    if (open === index) setOpen(null);
                                                    else setOpen(index);
                                                }}
                                            >
                                                {open === index ? <CloseOutlined /> : <VisibilityOutlined />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack direction="row" spacing={2}>
                                                <Avatar>
                                                    <img alt="" src={row.photo} height={30} />
                                                </Avatar>
                                                <Stack direction="column">
                                                    <Typography variant="subtitle1" minWidth="100%">
                                                        {row.prenom} {row.nom}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="normal">
                                                        {row.email}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.cin}</TableCell>
                                        <TableCell>{row.matricule}</TableCell>
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
                                                    onClick={() => handleDeleteOpen(row.id)}
                                                />
                                            </DeleteIcon>
                                        </TableCell>
                                    </TableRow>
                                    <Dialog
                                        open={openDelete}
                                        onClose={handleDeleteClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <Box sx={{ p: 1, py: 1.5 }}>
                                            <DialogTitle id="alert-dialog-title">Voulez vous supprimez cet adherent?</DialogTitle>
                                            <DialogActions>
                                                <Button color="secondary" onClick={handleDeleteClose}>
                                                    Annuler
                                                </Button>
                                                <Button variant="contained" color="error" onClick={handleDeleteRow(row.id)}>
                                                    Supprimer
                                                </Button>
                                            </DialogActions>
                                        </Box>
                                    </Dialog>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}></TableCell>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                            <Collapse in={open === index} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={4}>
                                                            <MainCard
                                                                sx={{
                                                                    height: '100%'
                                                                }}
                                                            >
                                                                <Stack alignItems="center" spacing={1}>
                                                                    <div class="avatar-preview">
                                                                        <div style={{ backgroundImage: `${row.photo}` }}></div>
                                                                    </div>

                                                                    <Typography variant="h5">{row.name}</Typography>

                                                                    {row.civilite === 'female' ? (
                                                                        <Stack
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            style={{ color: '#E75480' }}
                                                                            spacing={0.5}
                                                                        >
                                                                            <Face4 />
                                                                            <Typography>{row.civilite}</Typography>
                                                                        </Stack>
                                                                    ) : (
                                                                        <Stack
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            style={{ color: '#40a9ff' }}
                                                                            spacing={0.5}
                                                                        >
                                                                            <Face6 />
                                                                            <Typography>{row.civilite}</Typography>
                                                                        </Stack>
                                                                    )}
                                                                </Stack>
                                                            </MainCard>
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <MainCard title="Details personnels">
                                                                <Stack direction="row" justifyContent="flex start" spacing={24}>
                                                                    <Stack direction="column" spacing={0.5}>
                                                                        <Typography
                                                                            variant="body1"
                                                                            color="textSecondary"
                                                                            fontWeight="normal"
                                                                        >
                                                                            Nom complet
                                                                        </Typography>
                                                                        <Typography variant="body1" minWidth="100%">
                                                                            {row.name}
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="column" spacing={0.5}>
                                                                        <Typography
                                                                            variant="body1"
                                                                            color="textSecondary"
                                                                            fontWeight="normal"
                                                                        >
                                                                            Adresse E-mail
                                                                        </Typography>
                                                                        <Typography variant="body1" minWidth="100%">
                                                                            {row.email}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                                <Divider sx={{ margin: '1rem 0' }} />
                                                                <Stack direction="row" justifyContent="flex start" spacing={24}>
                                                                    <Stack direction="column" spacing={0.5}>
                                                                        <Typography
                                                                            variant="body1"
                                                                            color="textSecondary"
                                                                            fontWeight="normal"
                                                                        >
                                                                            Telephone
                                                                        </Typography>
                                                                        <Typography variant="body1" minWidth="100%">
                                                                            {row.telephone}
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack direction="column" spacing={0.5}>
                                                                        <Typography
                                                                            variant="body1"
                                                                            color="textSecondary"
                                                                            fontWeight="normal"
                                                                        >
                                                                            Date de naissance
                                                                        </Typography>
                                                                        <Typography variant="body1" minWidth="100%">
                                                                            {row.naissance}({age(row.naissance)} ans)
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            </MainCard>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Collapse>
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

export default Adherents;
