import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPen } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileEditForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (isEditing) {
            document.getElementById('firstName')?.focus();
        }
    }, [isEditing]);

    const onSubmit = (data) => console.log(data);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="profile-container">
            <div className="text-center mb-3">
                <img 
                    src={image || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="profile-image"
                />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="title">Edit Student Profile</h2>
                <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                    <FaPen /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
                <div>
                    <label className="form-label">Profile Photo</label>
                    <input type="file" accept="image/*" className="form-control" disabled={!isEditing} onChange={handleImageChange} />
                </div>

                {[
                    { label: "First Name", name: "firstName" },
                    { label: "Last Name", name: "lastName" },
                    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
                    { label: "Date of Birth", name: "dob", type: "date" },
                    { label: "Primary Diagnosis", name: "primaryDiagnosis" },
                    { label: "Comorbidity", name: "comorbidity" },
                    { label: "UDID No", name: "udidNo" },
                    { label: "Student ID", name: "studentId" },
                    { label: "Enrollment Year", name: "enrollmentYear", type: "number" },
                    { label: "Student Email", name: "studentEmail", type: "email" },
                    { label: "Status", name: "status", type: "select", options: ["Active", "Discontinued", "Temporarily Discontinued"] },
                    { label: "Primary Program", name: "primaryProgram", type: "select", options: ["SAMETI", "SATTVA", "SIDDHI", "SUTANTRA", "SHAALE", "SPRUHA", "VOCATIONAL"] },
                    { label: "Secondary Program", name: "secondaryProgram", type: "select", options: ["SAMETI", "SATTVA", "SIDDHI", "SUTANTRA", "SHAALE", "SPRUHA", "VOCATIONAL"] },
                    { label: "No. of Sessions", name: "sessions", type: "number", max: 50 },
                    { label: "Timings", name: "timings" },
                    { label: "Session Type", name: "sessionType", type: "select", options: ["Online", "Offline"] },
                    { label: "Father Name", name: "fatherName" },
                    { label: "Mother Name", name: "motherName" },
                    { label: "Blood Group", name: "bloodGroup" },
                    { label: "Allergies", name: "allergies" },
                    { label: "Contact Number", name: "contactNumber", type: "tel" },
                    { label: "Alternate Contact Number", name: "altContactNumber", type: "tel" },
                    { label: "Parent’s Email", name: "parentEmail", type: "email" },
                    { label: "Address", name: "address", type: "textarea" },
                    { label: "Strength", name: "strength", type: "textarea" },
                    { label: "Weakness", name: "weakness", type: "textarea" }
                ].map((field, index) => (
                    <div key={index}>
                        <label className="form-label">{field.label}</label>
                        {field.type === "textarea" ? (
                            <textarea {...register(field.name, { required: true })} className="form-control" rows="2" disabled={!isEditing}></textarea>
                        ) : field.type === "select" ? (
                            <select {...register(field.name, { required: true })} className="form-select" disabled={!isEditing}>
                                <option value="">Select</option>
                                {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        ) : (
                            <input type={field.type || "text"} {...register(field.name, { required: true })} className="form-control" disabled={!isEditing} max={field.max || undefined} />
                        )}
                    </div>
                ))}

                <div className="d-flex justify-content-between">
                    <a href="#" className="back-button">Back</a>
                    <button type="submit" className="save-button" disabled={!isEditing}>Save Profile</button>
                </div>
            </form>

            {/* Styles */}
            <style jsx>{`
                .profile-container {
                    background: #F3EEEA;
                    border: 0.5px solid #D6CCC2;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 800px;
                    margin: auto;
                }

                .profile-image {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 50%;
                    border: 3px solid #4A772F;
                }

                .title {
                    color: #2D2D2D;
                    font-weight: bold;
                }

                .edit-button {
                    background-color: #F8C630;
                    color: #fff;
                    border-radius: 8px;
                    padding: 0.5rem 1rem;
                    border: none;
                }

                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }

                .back-button, .save-button {
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    text-align: center;
                }

                .back-button {
                    background-color: #ddd;
                    color: #333;
                }

                .save-button {
                    background-color: #4A772F;
                    color: #fff;
                    border: none;
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .profile-container {
                        padding: 1rem;
                    }
                    .form-container {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .profile-container {
                        padding: 0.8rem;
                    }
                    .title {
                        font-size: 18px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfileEditForm;
