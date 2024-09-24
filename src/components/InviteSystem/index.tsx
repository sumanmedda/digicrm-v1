import { useState, ChangeEvent } from 'react';

interface Invite {
  email: string;
  status: 'Pending' | 'Accepted';
}

const InviteSystem: React.FC = () => {
  const [emails, setEmails] = useState<string>('');  // State to hold email input
  const [inviteList, setInviteList] = useState<Invite[]>([]);  // State to hold invite list
  const [searchTerm, setSearchTerm] = useState<string>('');  // State to hold search input

  // Handle email input change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  // Handle sending invitations
  const handleSendInvites = () => {
    if (!emails) return;  // Do nothing if no emails are entered

    const newEmails = emails
      .split(',')
      .map(email => email.trim())  // Trim whitespace around emails
      .filter(email => email.length > 0);  // Filter out empty strings

    const newInviteEntries = newEmails.map(email => ({
      email,
      status: 'Pending' as const,
    }));

    setInviteList([...inviteList, ...newInviteEntries]);
    setEmails('');  // Clear the email input
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle status change in the dropdown
  const handleStatusChange = (index: number, newStatus: 'Pending' | 'Accepted') => {
    const updatedInviteList = [...inviteList];
    updatedInviteList[index].status = newStatus;
    setInviteList(updatedInviteList);
  };

  // Filter invite list based on search term
  const filteredInviteList = inviteList.filter(invite =>
    invite.email.includes(searchTerm)
  );

  return (
    <div className="invite-system">
      {/* Email input and Send button */}
      <div className="invite-input-section">
        <input
          type="text"
          value={emails}
          onChange={handleEmailChange}
          placeholder="Enter email addresses separated by commas"
          className="invite-email-input"
        />
        <button onClick={handleSendInvites} className="send-invites-btn">
          Send
        </button>
      </div>

      {/* Search input */}
      <div className="search-input-section">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search emails..."
          className="search-email-input"
        />
      </div>

      {/* Invite list */}
      <table className="invite-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredInviteList.map((invite, index) => (
            <tr key={index}>
              <td>{invite.email}</td>
              <td>
                <select
                  value={invite.status}
                  onChange={(e) =>
                    handleStatusChange(index, e.target.value as 'Pending' | 'Accepted')
                  }
                  className="status-dropdown"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InviteSystem;