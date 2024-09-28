import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Table, Modal } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TeamContext } from '../context/TeamContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

const { Column } = Table;

const ChalanHistory = () => {
  const [chalanHistory, setChalanHistory] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedChalanId, setSelectedChalanId] = useState(null);
  const [chalanItems, setChalanItems] = useState([]);
  const [clientDetails, setClientDetails] = useState({});
  const [pdfPreviewSrc, setPdfPreviewSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const { teamId } = useContext(TeamContext);
  const api_address = process.env.REACT_APP_API_ADDRESS;
  
  useEffect(() => {
    fetchChalanHistory();
  }, [api_address, teamId]);

  // Fetch Chalan History
  const fetchChalanHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${api_address}/chalan_data`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setChalanHistory(res.data.data[0]); // Filter by team_id
      console.log(res.data.data[0])
    } catch (error) {
      console.error("Error fetching chalan history:", error);
      toast.error("Failed to fetch chalan history.");
    }
  };

  // Fetch Chalan Items
  const fetchChalanItems = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${api_address}/chalans/${id}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.items[0]; // Return fetched items
    } catch (error) {
      console.error("Error fetching chalan items:", error);
      toast.error("Failed to load chalan items.");
      return []; // Return empty array on error
    }
  };

  // Fetch Client Details by ID
  const fetchClientDetails = async (clientId) => {
    const token = localStorage.getItem('token');
    try {
        // Fetch client details from the API
        const response = await axios.get(`${api_address}/api/clients/read/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Log the entire response for debugging

        console.log("Client details response:", response.data);
        setClientDetails(response.data);
        // Directly return the fetched client details
        return response.data.client; 
    } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to load client details.");
        return {}; // Return empty object on error
    }
};



  // Fetch Chalan Items and Client Details
  const fetchChalanItemsAndClient = async (id, clientId) => {
    const items = await fetchChalanItems(id);
    const client = await fetchClientDetails(clientId);
    setChalanItems(items);
    setClientDetails(client);
    console.log(fetchClientDetails(clientId))
  };

  // Show Edit Modal
  const showEditModal = (id, clientId) => {
    setSelectedChalanId(id);
    fetchChalanItemsAndClient(id, clientId);
    setIsEditModalVisible(true);
  };

  // Hide Edit Modal
  const hideEditModal = () => {
    setIsEditModalVisible(false);
    setChalanItems([]); // Clear items on close
  };

  // Show PDF Preview Modal
  const showPreviewModal = async (id, clientId) => {
    setSelectedChalanId(id);
    await fetchChalanItemsAndClient(id, clientId);
    handlePreviewPdf(); // Generate PDF for preview
  };

  // Hide Preview Modal
  const hidePreviewModal = () => {
    setIsPreviewModalVisible(false);
    setPdfPreviewSrc(null);
  };

  const showDeleteModal = (id) => {
    setSelectedChalanId(id);
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  // Handle Delete Chalan
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${api_address}/chalans/${selectedChalanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      hideDeleteModal(); // Close modal after deletion
      fetchChalanHistory(); // Refresh chalan history
      toast.success("Chalan deleted successfully!");
    } catch (error) {
      console.error("Error deleting chalan:", error);
      toast.error("Failed to delete chalan.");
    }
  };

  // Generate PDF and show in modal
  const handlePreviewPdf = async () => {
    if (!selectedChalanId) {
      toast.error("Chalan not found!");
      return;
    }
  
    const selectedChalan = chalanHistory.find((chalan) => chalan.id === selectedChalanId);
    if (!selectedChalan) {
      toast.error("Chalan not found!");
      return;
    }
  
    // Ensure client details are fetched before generating the PDF
    if (!clientDetails || Object.keys(clientDetails).length === 0) {
      toast.error("Client details not found! Please try again.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Add header with custom styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Your Organization Name", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
     doc.text(`Client Name: ${clientDetails.client_name || "N/A"}`, 20, 30);
    doc.text(`Mobile Number: ${clientDetails.mobile_number || "N/A"}`, 20, 40);
    doc.text(`City: ${clientDetails.city || "N/A"}`, 20, 50);
    doc.text(`State: ${clientDetails.state || "N/A"}`, 20, 60);
    
    doc.setDrawColor(255, 0, 0);
    doc.line(20, 55, 190, 55); // Add a red line after the header
  
    // Add mid section with styling
    doc.setFontSize(18);
    doc.setFont("times", "italic");
    doc.text(`Challan Number: ${selectedChalan.id}`, 20, 70);
    doc.text(`Challan Date: ${new Date(selectedChalan.date).toLocaleDateString()}`, 20, 80);
  
    // Add client information
    doc.setFontSize(14);
    doc.setFont("courier", "bold");
    doc.text("Client Information:", 20, 100);
    
    // Check if clientDetails is defined before accessing its properties
    if (clientDetails) {
      doc.setFont("courier", "normal");
      doc.text(`Client Name: ${clientDetails.client_name || "N/A"}`, 20, 110);
      doc.text(`City: ${clientDetails.city || "N/A"}`, 20, 120);
      doc.text(`State: ${clientDetails.state || "N/A"}`, 20, 130);
    } else {
      doc.text(`Client Name: N/A`, 20, 110);
      doc.text(`City: N/A`, 20, 120);
      doc.text(`State: N/A`, 20, 130);
    }
  
    // Add items table using jsPDF-AutoTable
    const tableData = chalanItems.map(item => [item.product_name, item.quantity]);
    
    doc.autoTable({
      head: [['Product Name', 'Quantity']],
      body: tableData,
      startY: 140,
      theme: 'grid', // Add a grid theme to the table
      styles: {
        cellPadding: 5,
        fontSize: 12,
        overflow: 'linebreak',
        tableWidth: 'auto',
        halign: 'center',
      },
      headStyles: {
        fillColor: [0, 0, 0], // Red header background
        textColor: [255, 255, 255], // White text color
        fontSize: 14,
      },
      margin: { top: 20 },
    });
  
    // Add footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
  
    // Convert the PDF to a Blob URL for preview
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreviewSrc(pdfUrl); // Set PDF URL in state
    setIsPreviewModalVisible(true); // Show the preview modal
  };
  

  return (
    <div>
      <ToastContainer />
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: "calc(80vh - 74px)",
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            marginTop: 30,
            borderBottom: "2px black solid"
          }}
        ></div>
      <h2 style={{ marginBottom: 30 }}>Challan History</h2>
      {loading ? <p>Loading...</p> : (
        <Table dataSource={chalanHistory} rowKey="id" pagination={{ pageSize: 8 }}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Client ID" dataIndex="client_id" key="client_id" />
          <Column title="Date" dataIndex="date" key="date" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <div>
                <button onClick={() => showPreviewModal(record.id, record.client_id)}>View PDF</button>
                <button
                  type="info"
                  style={{ marginLeft: 8 }}
                  onClick={() => showEditModal(record.id, record.client_id)}
                >
                  Edit
                </button>
                <button
                  type="danger"
                  style={{ marginLeft: 8 }}
                  onClick={() => showDeleteModal(record.id)}
                >
                  Delete
                </button>
              </div>
            )}
          />
        </Table>
      )}

      {/* Custom Delete Confirmation Modal */}
      <Modal
        title="Are you sure?"
        open={isDeleteModalVisible}
        onCancel={hideDeleteModal}
        footer={[
          <button key="back" onClick={hideDeleteModal}>
            Close
          </button>,
          <button key="submit" type="primary" danger onClick={handleDelete}>
            Delete
          </button>,
        ]}
      >
        <p>Do you really want to delete this entry?</p>
      </Modal>

      {/* Edit Chalan Modal */}
      <Modal
        title="Edit Chalan"
        open={isEditModalVisible}
        onCancel={hideEditModal}
        footer={[
          <button key="back" onClick={hideEditModal}>
            Cancel
          </button>,
          <button key="submit" type="primary">
            Save
          </button>,
        ]}
      >
        <p>Chalan Items for Chalan ID: {selectedChalanId}</p>

        <Table dataSource={chalanItems} rowKey="product_id" pagination={false}>
          <Column title="Product Name" dataIndex="product_name" key="product_name" />
          <Column title="Quantity" dataIndex="quantity" key="quantity" />
        </Table>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        title="Preview PDF"
        open={isPreviewModalVisible}
        onCancel={hidePreviewModal}
        footer={[
          <button key="back" onClick={hidePreviewModal}>
            Close
          </button>,
          <button key="submit" type="primary" onClick={() => {
            const link = document.createElement('a');
            link.href = pdfPreviewSrc;
            link.download = `chalan_${selectedChalanId}.pdf`;
            link.click();
          }}>
            Download PDF
          </button>,
        ]}
      >
        <iframe src={pdfPreviewSrc} width="100%" height="500px" title="PDF Preview" />
      </Modal>
    </div>
    </div>
  );
};

export default ChalanHistory;
