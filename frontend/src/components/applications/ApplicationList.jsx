import ApplicationItem from "./ApplicationItem"

function ApplicationList ({applications, deleteApplication, updateApplication}) {
    return (
        <ul className="app-list">
            {applications.map(a => 
                <ApplicationItem 
                    key={a.application_id}
                    application={a}
                    deleteApplication={deleteApplication}
                    updateApplication={updateApplication}
                />
            )}
        </ul>
    )
}

export default ApplicationList