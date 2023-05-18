import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const Login = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="column" alignItems="center" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Login</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default Login;
