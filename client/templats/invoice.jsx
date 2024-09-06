                  .join('')}

const calculateTotalAmount = () => {
  return selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};


const invoiceHTML = `<html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
            .invoice-container { width: 800px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; color: #333; }
            .header img { width: 150px; }
            .header .company-details { text-align: right; }
            .header .company-details p { margin: 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007bff; color: white; }
            .total-row { font-weight: bold; }
            .footer { text-align: center; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div><h1>Invoice</h1></div>
              <div class="company-details">
                <h2>StockZen</h2>
                <p>123 Inventory St, Suite 456</p>
                <p>Pune, India</p>
                <p>Email: support@stockzen.com</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${selectedItems
                  .map(
                    (item) => `
                    <tr>
                      <td>${item.product_name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${item.price * item.quantity}</td>
                    </tr>`
                  )
                  .join('')}
                <tr class="total-row">
                  <td colspan="3">Total Amount</td>
                  <td>${calculateTotalAmount()}</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <p>Thank you for your business!</p>
              <p><strong>StockZen</strong> - Empowering your inventory management</p>
            </div>
          </div>
        </body>
      </html>`

      export default invoiceHTML