"""
Service for generating health reports
"""

import os
import uuid
from datetime import datetime
from typing import Dict, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from app.schemas.reports import HealthReportRequest, HealthReportResponse


class ReportService:
    """Service for generating health reports"""
    
    def __init__(self):
        # Use absolute path relative to the backend directory
        from pathlib import Path
        backend_dir = Path(__file__).parent.parent.parent
        self.reports_dir = str(backend_dir / "reports")
        os.makedirs(self.reports_dir, exist_ok=True)
    
    async def generate_report(self, request: HealthReportRequest) -> HealthReportResponse:
        """Generate comprehensive health report"""
        report_id = str(uuid.uuid4())
        
        # Create PDF
        pdf_path = os.path.join(self.reports_dir, f"report_{report_id}.pdf")
        doc = SimpleDocTemplate(pdf_path, pagesize=A4)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#6ba644'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # Title
        story.append(Paragraph("Livestock Health Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Report metadata
        story.append(Paragraph(f"<b>Report ID:</b> {report_id}", styles['Normal']))
        story.append(Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        if request.animal_id:
            story.append(Paragraph(f"<b>Animal ID:</b> {request.animal_id}", styles['Normal']))
        if request.breed:
            story.append(Paragraph(f"<b>Breed:</b> {request.breed}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Summary section
        story.append(Paragraph("<b>Executive Summary</b>", styles['Heading2']))
        total_assessments = len(request.assessments)
        if total_assessments > 0:
            risk_levels = [a.get('risk_level', 'Unknown') for a in request.assessments]
            low_count = risk_levels.count('Low')
            medium_count = risk_levels.count('Medium')
            high_count = risk_levels.count('High')
            
            summary_text = f"""
            This report contains {total_assessments} health assessments.
            <br/>Risk Distribution: {low_count} Low, {medium_count} Medium, {high_count} High
            <br/>Overall Health Status: {'Good' if low_count > total_assessments * 0.7 else 'Needs Attention'}
            """
            story.append(Paragraph(summary_text, styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Assessment history
        if request.assessments:
            story.append(Paragraph("<b>Assessment History</b>", styles['Heading2']))
            data = [['Date', 'Risk Level', 'Confidence', 'Breed']]
            for assessment in request.assessments[:10]:  # Limit to 10 most recent
                date_val = assessment.get('date', 'N/A')
                # Format date if it's a string
                if isinstance(date_val, str):
                    try:
                        from datetime import datetime
                        dt = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                        date_str = dt.strftime('%Y-%m-%d %H:%M')
                    except:
                        date_str = date_val
                else:
                    date_str = str(date_val)
                risk = assessment.get('risk_level', 'Unknown')
                confidence = assessment.get('confidence', 0)
                breed = assessment.get('breed', 'Unknown')
                data.append([date_str, risk, f"{confidence:.2%}", breed])
            
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6ba644')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)
            story.append(Spacer(1, 0.3*inch))
        
        # Recommendations
        story.append(Paragraph("<b>Recommendations</b>", styles['Heading2']))
        recommendations = [
            "Continue regular health monitoring",
            "Maintain proper nutrition and hydration",
            "Schedule regular veterinary checkups",
            "Monitor for any changes in behavior or appearance"
        ]
        for rec in recommendations:
            story.append(Paragraph(f"• {rec}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Disclaimer
        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(
            "This is a NON-DIAGNOSTIC tool. Always consult a qualified veterinarian for medical decisions.",
            disclaimer_style
        ))
        
        # Build PDF
        try:
            doc.build(story)
            print(f"PDF generated successfully: {pdf_path}")
        except Exception as e:
            print(f"Error building PDF: {e}")
            raise
        
        # Verify PDF was created
        if not os.path.exists(pdf_path):
            raise Exception(f"PDF file was not created at {pdf_path}")
        
        summary = {
            "total_assessments": total_assessments,
            "report_type": "comprehensive",
            "sections": ["summary", "history", "recommendations"]
        }
        
        return HealthReportResponse(
            report_id=report_id,
            pdf_url=f"/api/v1/download-report/{report_id}",
            summary=summary,
            generated_at=datetime.now()
        )
    
    async def get_report_path(self, report_id: str) -> Optional[str]:
        """Get file path for report"""
        pdf_path = os.path.join(self.reports_dir, f"report_{report_id}.pdf")
        if os.path.exists(pdf_path):
            return pdf_path
        return None

