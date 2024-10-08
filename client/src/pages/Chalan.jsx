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
  const [organizationDetails, setOrganizationDetails] = useState({})
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
            // console.log(res.data.data); // Log the entire data for debugging

            chalanData.forEach(chalan => {
              if (chalan.client_id) {
                fetchClientName(chalan.client_id);
              }
            });
            return chalanData; // Return the fetched data
        }else {
          console.error("Invalid response structure:", res.data);
          return []; // Return an empty array if response structure is invalid
      }
  } catch (error) {
      console.error("Error fetching chalan history:", error);
      toast.error("Failed to fetch chalan history.");
      return []; // Return an empty array in case of error
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
      /* The above code appears to be a comment block in JavaScript React. It is not performing any
      specific action in the code, but it is likely intended to provide information or context about
      the following code. */
      setClientDetails(response.data);
    })
    .catch(error => {
      console.error("Error fetching client details:", error);
      toast.error("Failed to load client details.");
    });
  };
  const orgId = localStorage.getItem('orgId')
  const fetchOrganizationDetails = () => {
    const token = localStorage.getItem('token');
    
    axios.get(`${api_address}/org/${orgId}`, {  
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      if (response.data && response.data.organization) {
        setOrganizationDetails(response.data.organization);  
      } else {
        console.error("Invalid response data:", response.data);
        toast.error("Failed to load organization details.");
      }
    })
    .catch(error => {
      console.error("Error fetching organization details:", error);
      toast.error("Failed to load organization details.");
    });
  };
  


  // Fetch Chalan Items and Client Details
  const fetchChalanItemsAndClient = async (id, clientId,orgId) => {
    const items = await fetchChalanItems(id);
    const client = await fetchClientDetails(clientId);
    const org = await fetchOrganizationDetails(orgId)
    setChalanItems(items);
    setClientDetails(client);
    setOrganizationDetails(org)
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
  // Handle Delete Chalan
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`${api_address}/chalans/${selectedChalanId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        hideDeleteModal(); // Close modal after deletion

        // Re-fetch the chalan history
        const updatedHistory = await fetchChalanHistory(); 

        // Check if updatedHistory is defined and is an array
        if (Array.isArray(updatedHistory)) {
            // If no chalans are left, clear the state
            if (updatedHistory.length === 0) {
                setChalanHistory([]);  // This will update the state to an empty array and re-render the table
            } else {
                setChalanHistory(updatedHistory); // Update the state with the new history
            }
        } else {
            console.error("Updated history is not an array:", updatedHistory);
        }

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

        if (!clientDetails || Object.keys(clientDetails).length === 0) {
            toast.error("Client details not found! Please try again.");
            return;
        }

        if (!chalanItems || chalanItems.length === 0) {
            toast.error("Chalan items not found! Please try again.");
            return;
        }

        const org = localStorage.getItem('orgName') || 'Your Organization';

        // Create a PDF document
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4', // A4 page format
        });

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        let yOffset = 15; // Initial offset for content

        // Colors for better layout
        const headerBgColor = 'black';  // 
        const textColor = '#333'; // Standard text color

        // Add organization header
        const addHeader = () => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(headerBgColor);
            doc.text(org, pageWidth / 2, yOffset, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(textColor);
            doc.text(`${organizationDetails.address},${organizationDetails.City},${organizationDetails.State}-${organizationDetails.Zip}`, pageWidth / 2, yOffset + 6, { align: "center" });
            doc.text(`${organizationDetails.phone} | ${organizationDetails.email}`, pageWidth / 2, yOffset + 12, { align: "center" });

            yOffset += 20; // Move down for the next section
            doc.setDrawColor(0, 75, 135); // Line color
            doc.line(10, yOffset, pageWidth - 10, yOffset); // Draw a line separator
            yOffset += 10; // Space after line
        };

        // Add footer at the bottom of every page
        const addFooter = () => {
            const footerY = pageHeight - 15; // Adjust footer positioning higher to fit in page
            doc.setFontSize(10);
            doc.setTextColor(textColor);
            doc.text("Thanks for your business!", pageWidth / 2, footerY, { align: "center" });

            doc.setFontSize(8);
            doc.text("Generated by www.stockzen.in", pageWidth / 2, footerY + 5, { align: "center" });
        };

        // Add Challan number and date
        const addChallanInfo = () => {
          // Set font for the labels (bold)
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(headerBgColor);
      
          // Add the bold "Challan Number" label
          doc.text(`Challan Number:`, 10, yOffset);
      
          // Set font for the value (normal)
          doc.setFont("helvetica", "normal");
          doc.setTextColor(textColor);  // Set text color for normal text
      
          // Add the normal value for Challan Number
          doc.text(`${selectedChalan.id}`, 45, yOffset); // Adjusted X position to align after the label
      
          // Same process for the date
          // Set font for the label (bold)
          doc.setFont("helvetica", "bold");
          doc.setTextColor(headerBgColor);
      
          // Add the bold "Date" label
          doc.text(`Date:`, pageWidth - 45, yOffset); // Adjusted X position to align to the right
      
          // Set font for the value (normal)
          doc.setFont("helvetica", "bold");
          doc.setTextColor(textColor);
      
          // Add the normal value for Date
          doc.text(`${new Date(selectedChalan.date).toLocaleDateString('en-GB')}`, pageWidth - 30, yOffset); // Adjusted X position to align after the label
      
          yOffset += 15; // Move down for the next section
      };
      

      const addClientDetails = () => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");  // Use default font helvetica instead of Arial
        doc.setTextColor(headerBgColor);
        doc.text("Client Information:", 10, yOffset);
    
        yOffset += 7; // Move down for the details
    
        doc.setFont("helvetica", "normal"); // Use normal weight
        doc.setFontSize(10);
        doc.setTextColor(textColor);
    
        doc.text(`${clientDetails.client_name || "N/A"}`, 10, yOffset);
        doc.text(`${clientDetails.address || "N/A"}, ${clientDetails.city || "N/A"}`, 10, yOffset + 6)
        doc.text(`${clientDetails.state || "N/A"}, ${clientDetails.zip || "N/A"}`, 10, yOffset + 12);
        doc.text(`Mobile Number: ${clientDetails.mobile_number || "N/A"}`, 10, yOffset + 18);
    
        yOffset += 30; // Space after client details
    };
    

        // Add table of challan items
        const addChallanItems = () => {
          const itemsPerPage = 15; // Adjust based on your layout
          const rowHeight = 10; // Height of each item
          let currentPageItems = 0; // Count of items on the current page
      
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(headerBgColor);
          doc.text("Challan Items:", 10, yOffset);
      
          yOffset += 4; // Start below the title
      
          // Table Header
          doc.setDrawColor(headerBgColor);
          doc.setFillColor(headerBgColor);
          doc.setTextColor('#fff'); // White text
          doc.rect(10, yOffset, pageWidth - 20, rowHeight, 'F'); // Draw header background
          doc.text("Product Name", 15, yOffset + 7);
          doc.text("Quantity", pageWidth - 40, yOffset + 7);
          
          yOffset += rowHeight; // Move down after header
      
          // Render items, handling page overflow
          chalanItems.forEach((item, index) => {
              // Check if we need to add a new page
              if (currentPageItems === itemsPerPage) {
                  addFooter(); // Add footer to the current page
                  doc.addPage(); // Create a new page
                  yOffset = 20; // Reset Y offset for the new page
                  currentPageItems = 0; // Reset item count for new page
                  
                  // Re-add the table header for the new page
                  doc.setTextColor('#fff'); // White text
                  doc.rect(10, yOffset, pageWidth - 20, rowHeight, 'F');
                  doc.text("Product Name", 15, yOffset + 7);
                  doc.text("Quantity", pageWidth - 40, yOffset + 7);
                  yOffset += rowHeight; // Move down after header
              }
      
              // Alternate row color for better readability
              if (index % 2 === 0) {
                  doc.setFillColor(242, 242, 242); // Light gray for alternate rows
                  doc.rect(10, yOffset, pageWidth - 20, rowHeight, 'F');
              }
      
              // Add product item
              doc.setFont("helvetica", "bold");
              doc.setTextColor(textColor);
              doc.text(item.product_name, 15, yOffset + 7);
              doc.text(item.quantity.toString(), pageWidth - 40, yOffset + 7);
              
              yOffset += rowHeight; // Move down for the next item
              currentPageItems++; // Increment current page item count
          });
      
          yOffset += 5; // Add space before the footer
      };
      

        // Start rendering the PDF
        addHeader();
        addChallanInfo();
        addClientDetails();
        addChallanItems();
        addFooter(); // Add footer on the last page

        // Create a Blob URL for the PDF
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfPreviewSrc(pdfUrl);
        setIsPreviewModalVisible(true);

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("An error occurred while generating the PDF. Check the console for details.");
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
<Modal
    title="Preview PDF"
    key={pdfPreviewSrc}
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