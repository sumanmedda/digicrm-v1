'use client'
import handleSendMail from '@/components/NewInvoice/mailerFunc'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DefaultLayout from '@/components/Layouts/DefaultLaout';

export default function PreviewInvoice() {
    const router = useRouter()
    const invoiceRef = useRef<HTMLDivElement | null>(null);
    const searchParams = useSearchParams()
    const [dialogVisible, setDialogVisible] = useState(false);
    const fromCompanyName = searchParams.get('name')

    const handleDownloadInvoice = async () => {
        const invoice = invoiceRef.current;
      
        if (invoice) {
          // Get the width and height of the invoice element
          const invoiceWidth = invoice.offsetWidth;
          const invoiceHeight = invoice.offsetHeight;
      
          // Dynamically adjust the scale to fit content into A4 page size
          const scale = 794 / invoiceWidth; // 794 is the width of A4 page in pixels (at 72 DPI)
      
          // Capture the element as canvas with adjusted scale
          const canvas = await html2canvas(invoice, {
            scale: scale, // Adjust the scale to fit content properly
            useCORS: true, // Ensure external images are loaded
            allowTaint: true,
          });
      
          const imgData = canvas.toDataURL('image/png');
      
          // Create a PDF with jsPDF
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
      
          // Get the height of the image scaled to fit the PDF width
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
          // Check if the content fits a single page, or needs multiple pages
          if (imgHeight > pdfHeight) {
            // If the content exceeds one page, we need to split it into multiple pages
            let position = 0;
            while (position < imgHeight) {
              pdf.addImage(imgData, 'PNG', 0, position - pdfHeight, pdfWidth, imgHeight);
              position += pdfHeight;
              if (position < imgHeight) {
                pdf.addPage();
              }
            }
          } else {
            // If content fits one page, just add the image
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
          }
      
          // Save the PDF
          pdf.save('invoice.pdf');
        }
    };
      

    return <>
    <DefaultLayout>
    <div className='invoice-btn-main'>
            <button className="invoice-btn bg-red-600 hover:bg-black" onClick={router.back}>Back</button>
            <div>
                <button className="invoice-btn bg-blue-700 hover:bg-black" onClick={handleDownloadInvoice} style={{marginRight:"5px"}}>Download</button>
                <button className="invoice-btn bg-green-500 hover:bg-black" onClick={() => handleSendMail("mailer mails").then(() => setDialogVisible(true))}>Send</button>
            </div>
        </div>
        <title />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]*/}
        <style
            dangerouslySetInnerHTML={{
                __html:
                    "\n    * {\n      box-sizing: border-box;\n    }\n\n    body {\n      margin: 0;\n      padding: 0;\n    }\n\n    a[x-apple-data-detectors] {\n      color: inherit !important;\n      text-decoration: inherit !important;\n    }\n\n    #MessageViewBody a {\n      color: inherit;\n      text-decoration: none;\n    }\n\n    p {\n      line-height: inherit\n    }\n\n    .desktop_hide,\n    .desktop_hide table {\n      mso-hide: all;\n      display: none;\n      max-height: 0px;\n      overflow: hidden;\n    }\n\n    .image_block img+div {\n      display: none;\n    }\n\n    sup,\n    sub {\n      line-height: 0;\n      font-size: 75%;\n    }\n\n    @media (max-width:670px) {\n\n      .desktop_hide table.icons-inner,\n      .social_block.desktop_hide .social-table {\n        display: inline-block !important;\n      }\n\n      .icons-inner {\n        text-align: center;\n      }\n\n      .icons-inner td {\n        margin: 0 auto;\n      }\n\n      .mobile_hide {\n        display: none;\n      }\n\n      .row-content {\n        width: 100% !important;\n      }\n\n      .stack .column {\n        width: 100%;\n        display: block;\n      }\n\n      .mobile_hide {\n        min-height: 0;\n        max-height: 0;\n        max-width: 0;\n        overflow: hidden;\n        font-size: 0px;\n      }\n\n      .desktop_hide,\n      .desktop_hide table {\n        display: table !important;\n        max-height: none !important;\n      }\n\n      .row-3 .column-1 .block-1.paragraph_block td.pad>div {\n        text-align: center !important;\n        font-size: 36px !important;\n      }\n\n      .row-3 .column-1 .block-1.paragraph_block td.pad,\n      .row-3 .column-2 .block-1.paragraph_block td.pad {\n        padding: 0 !important;\n      }\n\n      .row-3 .column-1 .block-3.spacer_block {\n        height: 20px !important;\n      }\n\n      .row-3 .column-1 .block-2.paragraph_block td.pad>div {\n        text-align: center !important;\n        font-size: 16px !important;\n      }\n\n      .row-3 .column-2 .block-1.paragraph_block td.pad>div {\n        text-align: center !important;\n        font-size: 14px !important;\n      }\n\n      .row-4 .column-1 .block-3.paragraph_block td.pad>div,\n      .row-7 .column-1 .block-3.paragraph_block td.pad>div {\n        text-align: center !important;\n      }\n\n      .row-4 .column-1 .block-3.paragraph_block td.pad,\n      .row-7 .column-1 .block-3.paragraph_block td.pad {\n        padding: 5px !important;\n      }\n\n      .row-5 .column-1 .block-3.paragraph_block td.pad>div {\n        font-size: 15px !important;\n      }\n\n      .row-7 .column-1 .block-2.paragraph_block td.pad>div {\n        text-align: center !important;\n        font-size: 32px !important;\n      }\n\n      .row-7 .column-1 .block-2.paragraph_block td.pad {\n        padding: 5px 5px 0 !important;\n      }\n\n      .row-9 .column-1 .block-1.spacer_block {\n        height: 40px !important;\n      }\n\n      .row-3 .column-1 {\n        padding: 30px 30px 0 !important;\n      }\n\n      .row-3 .column-2 {\n        padding: 0 30px !important;\n      }\n    }\n  "
            }}
        />
        {/*[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]*/}
        {/*[if true]><style>.forceBgColor{background-color: white !important}</style><![endif]*/}
        <div ref={invoiceRef}>
            <table
                className="nl-container"
                width="100%"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{
                    backgroundColor: "transparent",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "none",
                    backgroundPosition: "top left",
                    backgroundSize: "auto",
                    ...({
                        msoTableLspace: "0pt",
                        msoTableRspace: "0pt",
                    } as any),
                }}
            >
                <tbody>
                    <tr>
                        <td>
                            <table
                                className="row row-2"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    backgroundSize: "auto",
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{

                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundSize: "auto",
                                                    backgroundColor: "#f6f5f1",
                                                    width: 650,
                                                    margin: "0 auto",
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{

                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0,
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                            }}
                                                        >
                                                            <table
                                                                className="image_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{

                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad" style={{ width: "100%" }}>
                                                                            <div
                                                                                className="alignment"

                                                                                style={{ lineHeight: 10, alignContent: "center", alignItems: 'center' }}
                                                                            >
                                                                                <div style={{ maxWidth: 650 }}>
                                                                                    <img
                                                                                        src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8746/BEE_May20_MarketingAgency_Invoice_v01.jpg"
                                                                                        style={{
                                                                                            display: "block",
                                                                                            height: "auto",
                                                                                            border: 0,
                                                                                            width: "100%"
                                                                                        }}
                                                                                        width={650}
                                                                                        height="auto"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-3"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    backgroundRepeat: "no-repeat",
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundSize: "auto",
                                                    backgroundColor: "#007c86",
                                                    backgroundImage:
                                                        'url("https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8746/BEE_May20_MarketingAgency_Invoice_v02.jpg")',
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="50%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                paddingBottom: 50,
                                                                paddingLeft: 50,
                                                                paddingTop: 60,
                                                                verticalAlign: "bottom",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="paragraph_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            className="pad"
                                                                            style={{
                                                                                paddingBottom: 15,
                                                                                paddingLeft: 5,
                                                                                paddingRight: 5
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    color: "#ffffff",
                                                                                    fontFamily:
                                                                                        'TimesNewRoman, "Times New Roman", Times, Beskerville, Georgia, serif',
                                                                                    fontSize: 70,
                                                                                    fontWeight: 400,
                                                                                    letterSpacing: "-2px",
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "left",
                                                                                    ...({
                                                                                        msoLineHeightAlt: 84,

                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        wordBreak: "break-word"
                                                                                    }}
                                                                                >
                                                                                    <em>
                                                                                        <span
                                                                                            style={{
                                                                                                // wordBreak: "break-word",
                                                                                                color: "#ffffff"
                                                                                            }}
                                                                                        >
                                                                                            Invoice from
                                                                                        </span>
                                                                                    </em>

                                                                                </p>
                                                                                <span style={{ fontSize: "2rem" }}>
                                                                                    {fromCompanyName}</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="paragraph_block block-2"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad">
                                                                            <div
                                                                                style={{
                                                                                    color: "#ffffff",
                                                                                    direction: "ltr",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 18,
                                                                                    fontWeight: 400,
                                                                                    letterSpacing: 0,
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "left",
                                                                                    ...({
                                                                                        msoLineHeightAlt: "21.59999999999998.px",

                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p style={{ margin: 0 }}>
                                                                                    #{"{"}
                                                                                    {"{"}invoiceNumber{"}"}
                                                                                    {"}"}
                                                                                    <br />
                                                                                    Date: {"{"}
                                                                                    {"{"}invoiceDate{"}"}
                                                                                    {"}"}
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div
                                                                className="spacer_block block-3"
                                                                style={{ height: 30, lineHeight: 30, fontSize: 1 }}
                                                            >

                                                            </div>
                                                        </td>
                                                        <td
                                                            className="column column-2"
                                                            width="50%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                paddingBottom: 50,
                                                                paddingRight: 50,
                                                                paddingTop: 50,
                                                                verticalAlign: "bottom",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="paragraph_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad">
                                                                            <div
                                                                                style={{
                                                                                    color: "#ffffff",
                                                                                    direction: "ltr",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 18,
                                                                                    fontWeight: 400,
                                                                                    letterSpacing: 0,
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "right",

                                                                                    ...({
                                                                                        msoLineHeightAlt: "21.599999999999998px",

                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p style={{ margin: 0 }}>
                                                                                    Bill to:{"{"}
                                                                                    {"{"}billToClient{"}"}
                                                                                    {"}"}
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div
                                                                className="spacer_block block-2"
                                                                style={{ height: 30, lineHeight: 30, fontSize: 1 }}
                                                            >

                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-4"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                    backgroundSize: "auto"
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundSize: "auto",
                                                    backgroundColor: "#f6f5f1",
                                                    borderLeft: "30px solid transparent",
                                                    borderRight: "30px solid transparent",
                                                    borderTop: "30px solid transparent",
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                backgroundColor: "#ffffff",
                                                                paddingBottom: 30,
                                                                paddingTop: 30,
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="heading_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            className="pad"
                                                                            style={{ textAlign: "center", width: "100%" }}
                                                                        >
                                                                            <h1
                                                                                style={{
                                                                                    margin: 0,
                                                                                    color: "#222222",
                                                                                    direction: "ltr",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 24,
                                                                                    fontWeight: 400,
                                                                                    letterSpacing: "-1px",
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "center",
                                                                                    marginTop: 0,
                                                                                    marginBottom: 0,

                                                                                    ...({
                                                                                        msoLineHeightAlt: "28.799999999999997px",

                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    className="tinyMce-placeholder"
                                                                                    style={{ wordBreak: "break-word" }}
                                                                                >
                                                                                    Amount due:
                                                                                </span>
                                                                            </h1>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="paragraph_block block-2"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad">
                                                                            <div
                                                                                style={{
                                                                                    color: "#222222",
                                                                                    direction: "ltr",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 40,
                                                                                    fontWeight: 700,
                                                                                    letterSpacing: 0,
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "center",
                                                                                    ...({
                                                                                        msoLineHeightAlt: 48
                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p style={{ margin: 0 }}>
                                                                                    <strong>
                                                                                        ₹{"{"}
                                                                                        {"{"}finalAmount{"}"}
                                                                                        {"}"}
                                                                                    </strong>
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="paragraph_block block-3"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad" style={{ paddingTop: 5 }}>
                                                                            <div
                                                                                style={{
                                                                                    color: "#222222",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 14,
                                                                                    fontWeight: 400,
                                                                                    lineHeight: "150%",
                                                                                    textAlign: "center",
                                                                                    ...({
                                                                                        msoLineHeightAlt: 21
                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        wordBreak: "break-word"
                                                                                    }}
                                                                                >
                                                                                    Due on {"{"}
                                                                                    {"{"}dueDate{"}"}
                                                                                    {"}"}.
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-5"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                    backgroundSize: "auto"
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    backgroundColor: "#f6f5f1",
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundSize: "auto",
                                                    borderLeft: "30px solid transparent",
                                                    borderRight: "30px solid transparent",
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-6"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    backgroundColor: "#f6f5f1",
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    borderLeft: "20px solid transparent",
                                                    borderRight: "20px solid transparent",
                                                    borderTop: "20px solid transparent",
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                paddingBottom: 30,
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="table_block mobile_hide block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={10}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad">
                                                                            <table
                                                                                style={{
                                                                                    ...({
                                                                                        msoTableLspace: "0pt",
                                                                                        msoTableRspace: "0pt",
                                                                                    } as any),
                                                                                    borderCollapse: "collapse",
                                                                                    width: "100%",
                                                                                    tableLayout: "fixed",
                                                                                    direction: "ltr",
                                                                                    backgroundColor: "#ffffff",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontWeight: 400,
                                                                                    color: "#222222",
                                                                                    textAlign: "right",
                                                                                    letterSpacing: 0,
                                                                                    wordBreak: "break-all"
                                                                                }}
                                                                                width="100%"
                                                                            >
                                                                                <thead
                                                                                    style={{
                                                                                        verticalAlign: "top",
                                                                                        backgroundColor: "#eddab2",
                                                                                        color: "#222222",
                                                                                        fontSize: 16,
                                                                                        lineHeight: "120%",
                                                                                        textAlign: "right"
                                                                                    }}
                                                                                >
                                                                                    <tr>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>S.No</strong>
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Products
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            QTY
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Price
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody
                                                                                    style={{
                                                                                        verticalAlign: "top",
                                                                                        fontSize: 14,
                                                                                        lineHeight: "120%"
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Product 1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            5
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            ₹500
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Subtotal
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            ₹500.00
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Taxes (18%)
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            ₹65.00
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>Final Amount</strong>
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>₹565.00</strong>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="table_block desktop_hide block-2"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={10}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    msoHide: "all",
                                                                    display: "none",
                                                                    maxHeight: 0,
                                                                    overflow: "hidden"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad">
                                                                            <table
                                                                                style={{
                                                                                    ...({
                                                                                        msoTableLspace: "0pt",
                                                                                        msoTableRspace: "0pt",
                                                                                    } as any),
                                                                                    msoHide: "all",
                                                                                    display: "none",
                                                                                    maxHeight: 0,
                                                                                    overflow: "hidden",
                                                                                    borderCollapse: "collapse",
                                                                                    width: "100%",
                                                                                    tableLayout: "fixed",
                                                                                    direction: "ltr",
                                                                                    backgroundColor: "#ffffff",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontWeight: 400,
                                                                                    color: "#222222",
                                                                                    textAlign: "right",
                                                                                    letterSpacing: 0,
                                                                                    wordBreak: "break-all"
                                                                                }}
                                                                                width="100%"
                                                                            >
                                                                                <thead
                                                                                    style={{
                                                                                        verticalAlign: "top",
                                                                                        backgroundColor: "#eddab2",
                                                                                        color: "#222222",
                                                                                        fontSize: 11,
                                                                                        lineHeight: "120%",
                                                                                        textAlign: "right"
                                                                                    }}
                                                                                >
                                                                                    <tr>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>Service</strong>
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Qty
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Price
                                                                                        </th>
                                                                                        <th

                                                                                            style={{
                                                                                                width: "25%",
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                fontWeight: 700,
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Total
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody
                                                                                    style={{
                                                                                        verticalAlign: "top",
                                                                                        fontSize: 11,
                                                                                        lineHeight: "120%"
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            SEO
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Website Design
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Social Media
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Content
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            PPC Ads
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            1
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $100
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Subtotal
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $500.00
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            Taxes (%)
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            $65.00
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style={{ backgroundColor: "#f9f9f9" }}
                                                                                    >
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >

                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>GRAND TOTAL</strong>
                                                                                        </td>
                                                                                        <td
                                                                                            width="25%"
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                wordBreak: "break-word",
                                                                                                borderTop: "1px solid transparent",
                                                                                                borderRight:
                                                                                                    "1px solid transparent",
                                                                                                borderBottom:
                                                                                                    "1px solid transparent",
                                                                                                borderLeft: "1px solid transparent"
                                                                                            }}
                                                                                        >
                                                                                            <strong>$565.00</strong>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-7"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundColor: "#f6f5f1",
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundImage:
                                                        'url("https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8746/BG-yellow_2.jpg")',
                                                    backgroundSize: "cover",
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                paddingBottom: 40,
                                                                paddingLeft: 15,
                                                                paddingRight: 15,
                                                                paddingTop: 40,
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="image_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad" style={{ width: "100%" }}>
                                                                            <div
                                                                                className="alignment"

                                                                                style={{ lineHeight: 10, alignContent: "center", alignItems: "center" }}
                                                                            >
                                                                                <div style={{ maxWidth: 28 }}>
                                                                                    <img
                                                                                        src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8746/Flower-green_1.png"
                                                                                        style={{
                                                                                            display: "block",
                                                                                            height: "auto",
                                                                                            border: 0,
                                                                                            width: "100%"
                                                                                        }}
                                                                                        width={28}
                                                                                        height="auto"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="paragraph_block block-2"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            className="pad"
                                                                            style={{ paddingLeft: 25, paddingRight: 25 }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    color: "#222222",
                                                                                    fontFamily:
                                                                                        'TimesNewRoman, "Times New Roman", Times, Beskerville, Georgia, serif',
                                                                                    fontSize: 38,
                                                                                    fontWeight: 400,
                                                                                    letterSpacing: "-1px",
                                                                                    lineHeight: "120%",
                                                                                    textAlign: "center",
                                                                                    ...({
                                                                                        msoLineHeightAlt: "45.6px"
                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        wordBreak: "break-word"
                                                                                    }}
                                                                                >
                                                                                    Have<em> questions?</em>
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="paragraph_block block-3"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                    wordBreak: "break-word"
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            className="pad"
                                                                            style={{
                                                                                paddingBottom: 5,
                                                                                paddingLeft: 25,
                                                                                paddingRight: 25,
                                                                                paddingTop: 5
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    color: "#222222",
                                                                                    fontFamily:
                                                                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                    fontSize: 15,
                                                                                    fontWeight: 400,
                                                                                    lineHeight: "150%",
                                                                                    textAlign: "center",
                                                                                    ...({
                                                                                        msoLineHeightAlt: "12.5px"
                                                                                    } as any),
                                                                                }}
                                                                            >
                                                                                <p
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        wordBreak: "break-word"
                                                                                    }}
                                                                                >
                                                                                    We have answers. Get in touch with us via
                                                                                    email, phone or support chat.
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table
                                                                className="button_block block-4"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            className="pad"
                                                                            style={{
                                                                                paddingTop: 10,
                                                                                textAlign: "center"
                                                                            }}
                                                                        >
                                                                            <div className="alignment" style={{ alignContent: "center", alignItems: "center" }}>
                                                                                {/*[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://www.example.com" style="height:38px;width:181px;v-text-anchor:middle;" arcsize="27%" stroke="false" fillcolor="#222222">
    <w:anchorlock/>
    <v:textbox inset="0px,0px,0px,0px">
    <center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px">
    <![endif]*/}
                                                                                <a
                                                                                    href="tel:+919571470007"
                                                                                    target="_blank"
                                                                                    style={{
                                                                                        alignContent: "center",
                                                                                        alignItems: "center",
                                                                                        backgroundColor: "#222222",
                                                                                        borderBottom: "0px solid transparent",
                                                                                        borderLeft: "0px solid transparent",
                                                                                        borderRadius: 10,
                                                                                        borderRight: "0px solid transparent",
                                                                                        borderTop: "0px solid transparent",
                                                                                        color: "#ffffff",
                                                                                        display: "inline-block",
                                                                                        fontFamily:
                                                                                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                                                        fontSize: 14,
                                                                                        fontWeight: 400,
                                                                                        paddingBottom: 5,
                                                                                        paddingTop: 5,
                                                                                        textAlign: "center",
                                                                                        textDecoration: "none",
                                                                                        width: "auto",
                                                                                        height: "40px",
                                                                                        wordBreak: "keep-all",
                                                                                        ...({
                                                                                            msoBorderAlt: "none",
                                                                                        } as any),

                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            wordBreak: "break-word",
                                                                                            paddingLeft: 30,
                                                                                            paddingRight: 30,
                                                                                            fontSize: 14,
                                                                                            display: "inline-block",
                                                                                            letterSpacing: 2
                                                                                        }}
                                                                                    >
                                                                                        <span
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                wordBreak: "break-word",

                                                                                            }}
                                                                                        >
                                                                                            GET IN TOUCH
                                                                                        </span>
                                                                                    </span>
                                                                                </a>
                                                                                {/*[if mso]></center></v:textbox></v:roundrect><![endif]*/}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="row row-8"
                                align="center"
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                role="presentation"
                                style={{
                                    ...({
                                        msoTableLspace: "0pt",
                                        msoTableRspace: "0pt",
                                    } as any),
                                    backgroundSize: "auto"
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <table
                                                className="row-content stack"
                                                align="center"
                                                border={0}
                                                cellPadding={0}
                                                cellSpacing={0}
                                                role="presentation"
                                                style={{
                                                    ...({
                                                        msoTableLspace: "0pt",
                                                        msoTableRspace: "0pt",
                                                    } as any),
                                                    borderRadius: 0,
                                                    color: "#000000",
                                                    backgroundSize: "auto",
                                                    backgroundColor: "#f6f5f1",
                                                    width: 650,
                                                    margin: "0 auto"
                                                }}
                                                width={650}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="column column-1"
                                                            width="100%"
                                                            style={{
                                                                ...({
                                                                    msoTableLspace: "0pt",
                                                                    msoTableRspace: "0pt",
                                                                } as any),
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                verticalAlign: "top",
                                                                borderTop: 0,
                                                                borderRight: 0,
                                                                borderBottom: 0,
                                                                borderLeft: 0
                                                            }}
                                                        >
                                                            <table
                                                                className="image_block block-1"
                                                                width="100%"
                                                                border={0}
                                                                cellPadding={0}
                                                                cellSpacing={0}
                                                                role="presentation"
                                                                style={{
                                                                    ...({
                                                                        msoTableLspace: "0pt",
                                                                        msoTableRspace: "0pt",
                                                                    } as any),
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="pad" style={{ width: "100%" }}>
                                                                            <div
                                                                                className="alignment"

                                                                                style={{ lineHeight: 10, alignContent: "center", alignItems: "center" }}
                                                                            >
                                                                                <div style={{ maxWidth: 650 }}>
                                                                                    <img
                                                                                        src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8746/BEE_May20_MarketingAgency_Invoice_v01.jpg"
                                                                                        style={{
                                                                                            display: "block",
                                                                                            height: "auto",
                                                                                            border: 0,
                                                                                            width: "100%"
                                                                                        }}
                                                                                        width={650}
                                                                                        height="auto"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className='invoice-btn-main'>
            <button className="invoice-btn bg-red-600 hover:bg-black" onClick={router.back}>Back</button>
            <div>
                <button className="invoice-btn bg-blue-700 hover:bg-black" style={{marginRight:"5px"}}>Download</button>
                <button className="invoice-btn bg-green-500 hover:bg-black" onClick={() => handleSendMail("mailer mails").then(() => setDialogVisible(true))}>Send</button>
            </div>
        </div>
        {/* End */}
        {/* Dialog box for Invoice Sent */}
        {dialogVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center animate-fade-in">
              <h2 className="text-lg font-bold mb-2 text-green-600">Success!</h2>
              <p className="text-gray-700 mb-4">
                Invoice sent successfully to <span className="font-semibold">{"Mr Robort"}</span>
              </p>
              <button
                onClick={() => setDialogVisible(false)}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
              >
                OK
              </button>
            </div>
          </div>
          
        )}
    </DefaultLayout>
    </>

}