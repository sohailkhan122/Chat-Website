import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Groups = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getAllGroups');
                setGroups(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div className='listContainer'>
            <div className="ug-header">
                <img src="https://my.westcoastuniversity.edu/images/canvassupportchat.png" alt="welcome" style={{ height: "2rem", width: "2rem", marginLeft: "10px" }} />
                <p className='ugTittle'>Groups</p>
            </div>
            <div className="ugList">
                {groups.map((group, index) => (
                    <div key={group._id} className='conversation-container'>
                        {group.image ? (
                            <img style={{ cursor: 'pointer' }} className='con_icon' src={URL.createObjectURL(new Blob([new Uint8Array(group.image.data.data)], { type: group.image.contentType }))} alt='pro' />
                        ) : (
                            <p>Loading image...</p>
                        )}
                        <p className='con_tittle'>{group.name} Group</p>
                    </div>
                ))}
                <hr style={{ width: "90%", margin: '0 auto' }} />
            </div>
        </div>
    );
};

export default Groups;
