import * as React from 'react';
import { User } from '../../@types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { Errors } from '../../@types';
import { updateUser } from '../../service/users';

interface Props {
    user: User;
}
const schema = yup.object<User>().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Must be in email format').required('Email is required')
});

const UserDetail: React.FC<Props> = ({ user: initialUser }) => {
    const [user, setUser] = React.useState<User>(initialUser);

    const [errors, setErrors] = React.useState<Errors>({});

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // prevent component from reloading
        schema.validate(user, { abortEarly: false })
            .then(() => {
                setErrors({});
                if (user.id) {
                    updateUser(user).then(res => {
                        setUser(res.data);
                    });
                }
            }).catch((err: yup.ValidationError) => {
                const list: Errors = {};
                for (const e of err.inner) {
                    if (e.path) list[e.path] = e.message;
                }
                setErrors(list);
            });

    }

    const handleChange = (name: keyof User) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUser((prevUser) => ({
            ...prevUser,
            [name]: event.target.value,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="First Name"
                fullWidth
                value={user.firstName}
                margin="dense"
                variant="outlined"
                onChange={handleChange('firstName')}
                error={!!errors['firstName']}
                helperText={errors['firstName']}
            />
            <TextField
                label="Last Name"
                fullWidth
                value={user.lastName}
                margin="dense"
                variant="outlined"
                onChange={handleChange('lastName')}
                error={!!errors['lastName']}
                helperText={errors['lastName']}
            />
            <TextField
                label="Email"
                fullWidth
                value={user.email}
                margin="dense"
                variant="outlined"
                onChange={handleChange('email')}
                error={!!errors['email']}
                helperText={errors['email']}
            />

            <Button type="submit" variant="contained" color="primary">
                Save
            </Button>
        </form>
    );
};

export default UserDetail;
