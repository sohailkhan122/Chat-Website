import React from 'react';
import { Drawer } from 'antd';

const UserDrawer = ({ open, onClose, selectedUser }) => {
  return (
    <Drawer

      title="Profile Details"
      placement="left"
      onClose={onClose}
      open={open}
      width={403}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {selectedUser ? (
          <img style={{ width: '160px', height: '150px', borderRadius: '50%' }} src={URL.createObjectURL(new Blob([new Uint8Array(selectedUser.profileImage.data.data)], { type: selectedUser.profileImage.contentType }))} alt='pro' />
        ) : (
          <p style={{ fontSize: '14px' }}>Loading image...</p>
        )}
      </div>
      <p style={{ paddingTop: "10px", textAlign: 'center', fontSize: '28px', fontWeight: '600' }}>{selectedUser?.name}</p>
      <p style={{ paddingTop: "10px", textAlign: 'center', fontSize: '20px', fontWeight: '600' }}>Email: <span style={{ color: 'gray' }}>{selectedUser?.email}</span></p>
    </Drawer>
  );
};

export default UserDrawer;
