import axios from 'axios';

const api = axios.create({
    baseURL: "https://resume-builder-analyser-backend.vercel.app",
    withCredentials: true
});

/**
 * Generate a new interview report by sending job description, self description, and resume file
 */
export async function generateReport({ jobDescription, selfDescription, resumeFile }) {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    if (selfDescription) {
        formData.append('selfDescription', selfDescription);
    }
    if (resumeFile) {
        formData.append('resume', resumeFile);
    }

    const response = await api.post('/api/interview', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

/**
 * Fetch all interview reports for current user
 */
export async function getReports() {
    const response = await api.get('/api/interview');
    return response.data;
}

/**
 * Fetch detailed report by ID
 */
export async function getReportById(interviewId) {
    const response = await api.get(`/api/interview/${interviewId}`);
    return response.data;
}

/**
 * Delete interview report by ID
 */
export async function deleteReport(interviewId) {
    const response = await api.delete(`/api/interview/${interviewId}`);
    return response.data;
}
