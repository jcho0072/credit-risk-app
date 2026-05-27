import ApplicationItem from "./ApplicationItem"

function ApplicationList ({applications, deleteApplication, updateApplication}) {
    return (
        <div>
            <ul>
                {applications.map(a => 
                    <ApplicationItem 
                        key = {a.person_id}
                        application={a}
                        deleteApplication={deleteApplication}
                        updateApplication={updateApplication}
                    />

                )}

            </ul>

        </div>
    )
}

export default ApplicationList