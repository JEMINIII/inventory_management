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
  const [clientNamesMap, setClientNamesMap] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    fetchChalanHistory();
  }, [api_address, teamId]);

  // Fetch Chalan History
  const fetchChalanHistory = async () => {
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('orgId'); // Assuming orgId is stored in local storage

    if (!orgId) {
        toast.error("Organization ID is required.");
        return;
    }

    try {
        const res = await axios.get(`${api_address}/chalan_data`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { orgId }, // Pass orgId as a query parameter
            withCredentials: true,
        });

        // Ensure data is an array and contains items before accessing the first element
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
            const chalanData = res.data.data;
            setChalanHistory(res.data.data); // Set the entire array of chalan history
            console.log(res.data.data); // Log the entire data for debugging

            chalanData.forEach(chalan => {
              if (chalan.client_id) {
                fetchClientName(chalan.client_id);
              }
            });

        } else {
            toast.error("No chalan history found.");
        }
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



  const fetchClientName = (clientId) => {
    const token = localStorage.getItem('token');
    
    axios.get(`${api_address}/api/clients/read/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    .then(res => {
      if (res.data) {
        setClientNamesMap(prev => ({
          ...prev,
          [clientId]: res.data.client_name,
        }));
      }
    })
    .catch(error => {
      console.error("Error fetching client details:", error);
      toast.error("Failed to load client name.");
    });
  };
  

  const renderClientName = (text, record) => {
    return clientNamesMap[record.client_id] || "Loading...";
  };
  // console.log(clientNamesMap)

  // Fetch Client Details by ID
  const fetchClientDetails = (clientId) => {
    const token = localStorage.getItem('token');
    
    axios.get(`${api_address}/api/clients/read/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setClientDetails(response.data);
    })
    .catch(error => {
      console.error("Error fetching client details:", error);
      toast.error("Failed to load client details.");
    });
  };
  



  // Fetch Chalan Items and Client Details
  const fetchChalanItemsAndClient = async (id, clientId) => {
    const items = await fetchChalanItems(id);
    const client = await fetchClientDetails(clientId);
    setChalanItems(items);
    setClientDetails(client);
    // console.log(fetchClientDetails(clientId))
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
  // Show PDF Preview Modal
  const showPreviewModal = async (id, clientId) => {
    setSelectedChalanId(id);
    setPdfPreviewSrc(null); // Clear previous PDF source properly
    setChalanItems([]); // Clear previous Chalan items
    setClientDetails({}); // Clear previous client details
    setLoading(true); // Start loading state

    try {
        // Fetch new items and client details
        await fetchChalanItemsAndClient(id, clientId);

        // Generate PDF for preview
        await handlePreviewPdf();
    } catch (error) {
        console.error("Error showing preview modal:", error);
        toast.error("Failed to load chalan items or client details.");
    } finally {
        setLoading(false); // End loading state
    }
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
    try {
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

        // Ensure chalan items are fetched
        if (!chalanItems || chalanItems.length === 0) {
            toast.error("Chalan items not found! Please try again.");
            return;
        }
  
    const doc = new jsPDF();
const orgName = localStorage.getItem('orgName');
const pageWidth = doc.internal.pageSize.getWidth();
// Add header with custom styles
// Set font and add organization name in bold and larger size
// const textWidth = doc.getTextWidth(orgName);
// Right align organization details
const rightMargin = 20; // Margin from the right
const rightX = doc.internal.pageSize.getWidth() - rightMargin;
const x = 75
doc.setFont("helvetica", "bold");
doc.setFontSize(28); // Large font size for organization name
doc.text(orgName, rightX, 30, { align: 'right' }); // Right-aligned organization name

// Right align organization details
doc.setFontSize(10); // Smaller font size for organization details
doc.setTextColor(100); // Grey color for subheadings



// Add organization details on the right side
doc.text(`Mobile Number: 463788477`, rightX, 40, { align: 'right' });
doc.text(`City: Ahamedabad`, rightX, 50, { align: 'right' });
doc.text(`State: Gujarat`, rightX, 60, { align: 'right' });

// Draw a black line to separate the header
doc.line(20, 65, 190, 65); // Line across the page

// Add mid-section for Challan information
// Add mid-section for Challan information
doc.setFontSize(16); // Set font size for the title
doc.setFont("helvetica", "bold"); // Set font to bold for titles
doc.text(`Challan Number:`, 20, 80); // Title for Challan Number

doc.setFont("helvetica", "normal"); // Change font back to normal for details
doc.setFontSize(14); // Slightly smaller font size for details
doc.text(` ${selectedChalan.id}`, 20 + doc.getTextWidth("Challan Number: ") + 5, 80); // Details for Challan Number

doc.setFont("helvetica", "bold"); // Set font to bold again for titles
doc.setFontSize(16); // Set font size for the title
doc.text(`Challan Date:`, 20, 90); // Title for Challan Date

doc.setFont("helvetica", "normal"); // Change font back to normal for details
doc.setFontSize(14); // Slightly smaller font size for details
doc.text(`${new Date(selectedChalan.date).toLocaleDateString()}`, 20 + doc.getTextWidth("Challan Date: ") + 5, 90); // Details for Challan Date

// Add client information section with proper styling
doc.setFontSize(14); // Medium bold font for Client Information
doc.setFont("helvetica", "bold");
doc.text("Client Information:", 20, 110);

// Set regular font for client details
doc.setFont("helvetica", "normal");
doc.setFontSize(12); // Small regular font for client details
doc.text(`Client Name: ${clientDetails.client_name || "N/A"}`, 20, 120);
doc.text(`City: ${clientDetails.city || "N/A"}`, 20, 130);
doc.text(`State: ${clientDetails.state || "N/A"}`, 20, 140);
doc.text(`Mobile Number: ${clientDetails.mobile_number || "N/A"}`, 20, 150);

// Prepare table for Chalan items
const tableData = chalanItems.map(item => [item.product_name, item.quantity]);

const startY = 160; // Start the table below the client information
doc.autoTable({
    head: [['Product Name', 'Quantity']],
    body: tableData,
    startY: startY, // Start the table
    theme: 'grid', // Use grid theme for a cleaner layout
    styles: {
        cellPadding: 5,
        fontSize: 12,
        overflow: 'linebreak',
        halign: 'center',
    },
    headStyles: {
        fillColor: [0, 0, 0], // Black background for header
        textColor: [255, 255, 255], // White text in header
        fontSize: 14,
    },
    margin: { top: 20 }, // Keep space above the table
});

// Calculate the position for the footer based on the table height
const finalY = doc.lastAutoTable.finalY + 10; // Adding some space below the table

// Footer section with centered "Thanks for your business" message
doc.setFont("helvetica", "normal");
doc.setFontSize(10); // Small font size for footer
doc.text("Thanks for your business", pageWidth / 1.092, finalY, { align: 'right' }); // Centered text

// Center the "Generated by stockzen" text in smaller font
const fixedYPosition = 290; // Fixed Y position for the "Generated by" text
const leftX = 20; // Margin from the left side
doc.setFontSize(8); // Smaller font size for generated by text
doc.text("Generated by www.stockzen.in", leftX, fixedYPosition, { align: 'left' });


  
    // Convert the PDF to a Blob URL for preview
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreviewSrc(pdfUrl); // Set PDF URL in state
    setIsPreviewModalVisible(true); // Show the preview modal
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("An error occurred while generating the PDF.");
  }
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
        >
      <h2 style={{ marginBottom: 30 }}>Challan History</h2></div>
      {loading ? <p>Loading...</p> : (
        <Table dataSource={chalanHistory} rowKey="id" pagination={{ pageSize: 8 }}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Client Name" key="client_name" render={renderClientName} />
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
      {/* PDF Preview Modal */}
{/* PDF Preview Modal */}
<Modal
    title="Preview PDF"
    key={selectedChalanId} // Change this to use selectedChalanId
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
    {pdfPreviewSrc ? (
        <iframe src={pdfPreviewSrc} width="100%" height="500px" title="PDF Preview" />
    ) : (
        <p>Loading PDF...</p> // Show loading state until the PDF is ready
    )}
</Modal>


    </div>
    </div>
  );
};

export default ChalanHistory;