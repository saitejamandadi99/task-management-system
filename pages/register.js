import Link from 'next/link';
import styles from '../styles/Register.module.css';

import {useState} from 'react';
import axios from'axios';
import { useRouter } from 'next/router';
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error , setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if (password !== confirmPassword){
            setError('Passwords does not match');
            setSuccess('');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {name, email, password});
            console.log('Response data: ', response.data);
            if(response.status === 201){
                const {message, user} = response.data;
                setSuccess(message);
                setError('');
                localStorage.setItem('token', user.token);
                localStorage.setItem('user',JSON.stringify(user));
                    router.push('/dashboard');
               

            }
            
        } catch (error) {
            setError(error.response?.data?.message || 'Registration Failed');
            setSuccess('');
        }
    }
  return (
    <div className={`container-fluid ${styles.registerWrapper}`}>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className={`card shadow ${styles.registerCard}`}>
            <div className="card-body">
              <h2 className={`text-center mb-4 ${styles.title}`}>Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className={`form-label ${styles.formLabel}`}>Full Name</label>
                  <input type="text" className={`form-control ${styles.inputField}`} id="name" placeholder="Enter your name" onChange = {(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className={`form-label ${styles.formLabel}`}>Email address</label>
                  <input type="email" className={`form-control ${styles.inputField}`} id="email" placeholder="Enter email" onChange = {(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className={`form-label ${styles.formLabel}`}>Password</label>
                  <input type="password" className={`form-control ${styles.inputField}`} id="password" placeholder="Enter password" onChange = {(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className={`form-label ${styles.formLabel}`}>Confirm Password</label>
                  <input type="password" className={`form-control ${styles.inputField}`} id="confirmPassword" placeholder="Confirm password" onChange = {(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className={`btn btn-primary ${styles.registerButton}`}>Sign Up</button>
                </div>
              </form>
              {error && <div className='alert alert-danger'> {error} </div>}
              {success && <div className='alert alert-success'> {success} </div>}
        
              <div className="text-center">
                <p className="mb-0">Already have an account? <Link href="/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
