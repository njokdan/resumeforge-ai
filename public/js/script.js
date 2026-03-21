let selectedFile = null;
let linkedinFile = null;

// Drag & Drop + File Select
$('#dropZone').on('click', () => $('#resumeFile').click());

$('#resumeFile').on('change', function(e) {
  selectedFile = e.target.files[0];
  $('#fileName').text(selectedFile ? selectedFile.name : '');
});

$('#dropZone').on('dragover', function(e) {
  e.preventDefault();
  $(this).addClass('border-success');
});

$('#dropZone').on('dragleave', function() {
  $(this).removeClass('border-success');
});

$('#dropZone').on('drop', function(e) {
  e.preventDefault();
  $(this).removeClass('border-success');
  selectedFile = e.originalEvent.dataTransfer.files[0];
  $('#fileName').text(selectedFile ? selectedFile.name : '');
});

$('#linkedinDropZone').on('click', () => $('#linkedinFile').click());

$('#linkedinFile').on('change', function(e) {
  linkedinFile = e.target.files[0];
  $('#linkedinFileName').text(linkedinFile ? linkedinFile.name : '');
});

// Resume Optimization
// $('#optimizeForm').on('submit', async function(e) {
//   e.preventDefault();

//   if (!selectedFile && !$('#jobDesc').val().trim()) {
//     alert('Please upload a resume or paste a job description');
//     return;
//   }

//   $('#loading').show();
//   $('#submitBtn').prop('disabled', true);

//   const formData = new FormData();
//   if (selectedFile) formData.append('resume', selectedFile);
//   formData.append('jobDesc', $('#jobDesc').val());

//   $.ajax({
//     url: '/api/optimize',
//     type: 'POST',
//     data: formData,
//     processData: false,
//     contentType: false,
//     success: function(response) {
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);
//       $('#resultsSection').fadeIn();

//       $('#atsScore').text((response.ats_score || 0) + '%');

//       $('#aiResults').html(`
//         <h5 class="text-success mb-3">📋 AI Optimization Report</h5>
//         <div class="mb-3">
//           <strong>Missing Keywords:</strong> 
//           ${response.missing_keywords?.map(k => `<span class="badge bg-warning text-dark">${k}</span>`).join(' ') || 'None detected'}
//         </div>
//         <div class="mb-3">
//           <strong>Rewritten Professional Summary:</strong><br>
//           <p class="bg-dark p-3 rounded">${response.rewritten_summary || 'No summary generated'}</p>
//         </div>
//         <div>
//           <strong>Suggested Experience Bullets:</strong>
//           <ul>${response.rewritten_experience?.map(b => `<li>${b}</li>`).join('') || '<li>No suggestions</li>'}</ul>
//         </div>
//         <div class="alert alert-info mt-4">
//           <strong>Pro Tips:</strong><br>${response.tips?.join('<br>') || 'No tips available'}
//         </div>
//       `);

//       // Add copy buttons after content is rendered
//       addCopyButtonsToResults();
//     },
//     error: function(xhr, status, error) {
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);
//       console.error('Optimization error:', error);
//       alert('AI service error. Please check your API keys or try again later.');
//     }
//   });
// });

// $('#optimizeForm').on('submit', async function(e) {
//   e.preventDefault();

//   if (!selectedFile && !$('#jobDesc').val().trim()) {
//     alert('Please upload a resume or paste a job description');
//     return;
//   }

//   $('#loading').show();
//   $('#submitBtn').prop('disabled', true);

//   const formData = new FormData();
//   if (selectedFile) formData.append('resume', selectedFile);
//   formData.append('jobDesc', $('#jobDesc').val());

//   $.ajax({
//     url: '/api/optimize',
//     type: 'POST',
//     data: formData,
//     processData: false,
//     contentType: false,
//     success: function(response) {
//       // Always hide first – safety net
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);

//       try {
//         $('#resultsSection').fadeIn();
//         $('#atsScore').text((response.ats_score || 0) + '%');

//         $('#aiResults').html(`
//           <h5 class="text-success mb-3">📋 AI Optimization Report</h5>
//           <div class="mb-3">
//             <strong>Missing Keywords:</strong> 
//             ${response.missing_keywords?.map(k => `<span class="badge bg-warning text-dark">${k}</span>`).join(' ') || 'None detected'}
//           </div>
//           <div class="mb-3">
//             <strong>Rewritten Professional Summary:</strong><br>
//             <p class="bg-dark p-3 rounded">${response.rewritten_summary || 'No summary generated'}</p>
//           </div>
//           <div>
//             <strong>Suggested Experience Bullets:</strong>
//             <ul>${response.rewritten_experience?.map(b => `<li>${b}</li>`).join('') || '<li>No suggestions</li>'}</ul>
//           </div>
//           <div class="alert alert-info mt-4">
//             <strong>Pro Tips:</strong><br>${response.tips?.join('<br>') || 'No tips available'}
//           </div>
//         `);

//         addCopyButtonsToResults();
//       } catch (err) {
//         console.error('Error rendering results:', err);
//         alert('Results received but display failed. Check console for details.');
//       }
//     },
//     error: function(xhr, status, error) {
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);
//       console.error('AJAX error:', status, error, xhr.responseText);
//       alert('AI service error. Please check your API keys or try again later.');
//     },
//     complete: function() {
//       // Ultimate safety: hide in ALL cases (timeout, abort, etc.)
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);
//     }
//   });
// });

// $('#optimizeForm').on('submit', function(e) {
//   e.preventDefault();

//   if (!selectedFile && !$('#jobDesc').val().trim()) {
//     alert('Please upload a resume or paste a job description');
//     return;
//   }

//   $('#loading').show();
//   $('#submitBtn').prop('disabled', true);

//   const formData = new FormData();
//   if (selectedFile) formData.append('resume', selectedFile);
//   formData.append('jobDesc', $('#jobDesc').val());

//   $.ajax({
//     url: '/api/optimize',
//     type: 'POST',
//     data: formData,
//     processData: false,
//     contentType: false,
//     timeout: 30000, // 30 seconds timeout
//     success: function(response) {
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);

//       try {
//         $('#resultsSection').fadeIn();
//         $('#atsScore').text((response.ats_score || 0) + '%');

//         let html = `
//           <h5 class="text-success mb-3">📋 AI Optimization Report</h5>
//           <div class="mb-3">
//             <strong>Missing Keywords:</strong> 
//             ${(Array.isArray(response.missing_keywords) ? response.missing_keywords : []).map(k => `<span class="badge bg-warning text-dark">${k}</span>`).join(' ') || 'None detected'}
//           </div>
//           <div class="mb-3">
//             <strong>Rewritten Professional Summary:</strong><br>
//             <p class="bg-dark p-3 rounded">${response.rewritten_summary || 'No summary generated'}</p>
//           </div>
//           <div>
//             <strong>Suggested Experience Bullets:</strong>
//             <ul>${(Array.isArray(response.rewritten_experience) ? response.rewritten_experience : []).map(b => `<li>${b}</li>`).join('') || '<li>No suggestions</li>'}</ul>
//           </div>
//           <div class="alert alert-info mt-4">
//             <strong>Pro Tips:</strong><br>${(Array.isArray(response.tips) ? response.tips : []).join('<br>') || 'No tips available'}
//           </div>
//         `;

//         $('#aiResults').html(html);
//         addCopyButtonsToResults();
//       } catch (err) {
//         console.error('Rendering error:', err);
//         alert('Got response but failed to display it. Check console.');
//       }
//     },
//     error: function(xhr, status, error) {
//       console.error('AJAX failed:', status, error, xhr.responseText);
//       alert('Error: ' + (xhr.responseText || 'Server error or network issue'));
//     },
//     complete: function() {
//       $('#loading').hide();
//       $('#submitBtn').prop('disabled', false);
//     }
//   });

//   // Safety timeout: hide after 45 seconds no matter what
//   setTimeout(() => {
//     $('#loading').hide();
//     $('#submitBtn').prop('disabled', false);
//   }, 45000);
// });

$('#optimizeForm').on('submit', function(e) {
  e.preventDefault();

  if (!selectedFile && !$('#jobDesc').val().trim()) {
    alert('Please upload a resume or paste a job description');
    return;
  }

  // Show loader
  $('#loading').addClass('visible');
  $('#submitBtn').prop('disabled', true);

  const formData = new FormData();
  if (selectedFile) formData.append('resume', selectedFile);
  formData.append('jobDesc', $('#jobDesc').val());

  $.ajax({
    url: '/api/optimize',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    timeout: 45000, // safety timeout
    success: function(response) {
      try {
        $('#resultsSection').fadeIn(400, function() {
          // Optional: smooth scroll to results
          $('html, body').animate({
            scrollTop: $("#resultsSection").offset().top - 80
          }, 600);
        });
        $('#atsScore').text((response.ats_score || 0) + '%');

        let html = `
          <h5 class="text-success mb-3">📋 AI Optimization Report</h5>
          <div class="mb-3">
            <strong>Missing Keywords:</strong> 
            ${(Array.isArray(response.missing_keywords) ? response.missing_keywords : []).map(k => `<span class="badge bg-warning text-dark">${k}</span>`).join(' ') || 'None'}
          </div>
          <div class="mb-3">
            <strong>Rewritten Professional Summary:</strong><br>
            <p class="bg-dark p-3 rounded">${response.rewritten_summary || 'No summary generated'}</p>
          </div>
          <div>
            <strong>Suggested Experience Bullets:</strong>
            <ul>${(Array.isArray(response.rewritten_experience) ? response.rewritten_experience : []).map(b => `<li>${b}</li>`).join('') || '<li>No suggestions</li>'}</ul>
          </div>
          <div class="alert alert-info mt-4">
            <strong>Pro Tips:</strong><br>${(Array.isArray(response.tips) ? response.tips : []).join('<br>') || 'No tips available'}
          </div>
        `;

        $('#aiResults').html(html);
        addCopyButtonsToResults();
      } catch (err) {
        console.error('Error displaying results:', err);
        alert('Response received but display failed. Check console.');
      }

      window.lastResumeOptimization = response;  // save for later use
    },
    error: function(xhr, status, error) {
      console.error('Request failed:', status, error, xhr.responseText);
      alert('Could not optimize resume. Server error or connection issue.');
    },
    complete: function() {
      // Always hide when done (success, error, timeout...)
      $('#loading').removeClass('visible');
      $('#submitBtn').prop('disabled', false);
    }
  });

  // Extra safety: force hide after 50 seconds
  setTimeout(() => {
    $('#loading').removeClass('visible');
    $('#submitBtn').prop('disabled', false);
  }, 50000);
});


// Helper: Add copy buttons to dynamic content
function addCopyButtonsToResults() {
  // Summary paragraph
  $('#aiResults .bg-dark.p-3').each(function() {
    addCopyButton($(this));
  });

  // Bullets list (whole container)
  $('#aiResults ul').each(function() {
    addCopyButton($(this));
  });
}

function addCopyButton(element) {
  // Avoid adding multiple buttons
  if (element.find('.copy-btn').length > 0) return;

  const btn = $('<button class="btn btn-sm btn-outline-success ms-2 copy-btn"><i class="fas fa-copy"></i> Copy</button>');
  btn.on('click', function() {
    const textToCopy = element.text().trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      btn.html('<i class="fas fa-check"></i> Copied!').prop('disabled', true);
      setTimeout(() => {
        btn.html('<i class="fas fa-copy"></i> Copy').prop('disabled', false);
      }, 2000);
    }).catch(err => {
      console.error('Clipboard error:', err);
      alert('Failed to copy');
    });
  });
  element.append(btn);
}

// PDF Export for Resume (requires jsPDF loaded via CDN)
$('#exportPdfBtn').on('click', function() {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    alert('jsPDF library not loaded. Please check your internet connection or page scripts.');
    console.error('jsPDF not available');
    return;
  }

  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('ResumeForge AI Optimization Report', 20, 20);

  doc.setFontSize(12);
  doc.text(`ATS Score: ${$('#atsScore').text()}`, 20, 35);

  let y = 50;
  doc.text('Missing Keywords:', 20, y); y += 10;
  const keywords = $('#aiResults .badge').map((i, e) => $(e).text()).get().join(', ');
  doc.text(keywords || 'None', 30, y); y += 15;

  doc.text('Rewritten Professional Summary:', 20, y); y += 10;
  const summaryText = $('#aiResults .bg-dark.p-3').text().trim();
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, 30, y);
  y += summaryLines.length * 7 + 10;

  doc.text('Suggested Experience Bullets:', 20, y); y += 10;
  const bullets = $('#aiResults ul li').map((i, e) => $(e).text()).get();
  bullets.forEach(b => {
    const bulletLines = doc.splitTextToSize(`• ${b}`, 170);
    doc.text(bulletLines, 30, y);
    y += bulletLines.length * 7 + 2;
  });

  doc.save('Resume_Optimization_Report.pdf');
});

// Cover Letter Generation
$('#generateCoverBtn').on('click', function() {
  $('#coverLoading').show();
  $('#generateCoverBtn').prop('disabled', true);

  const formData = new FormData();
  if (selectedFile) formData.append('resume', selectedFile);
  formData.append('jobDesc', $('#jobDesc').val());
  formData.append('tone', $('#toneSelect').val());
  formData.append('length', $('#lengthSelect').val());

  $.ajax({
    url: '/api/generate-cover',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      $('#coverLoading').hide();
      $('#generateCoverBtn').prop('disabled', false);

      if (response.cover_letter) {
        $('#coverResult').text(response.cover_letter).fadeIn();
        $('#coverActions').fadeIn();

        // Copy cover letter
        $('#copyCoverBtn').off('click').on('click', function() {
          navigator.clipboard.writeText(response.cover_letter).then(() => {
            $(this).html('<i class="fas fa-check"></i> Copied!').prop('disabled', true);
            setTimeout(() => $(this).html('<i class="fas fa-copy"></i> Copy').prop('disabled', false), 2000);
          }).catch(err => {
            console.error('Copy failed:', err);
            alert('Failed to copy');
          });
        });

        // PDF export for cover letter
        $('#exportCoverPdfBtn').off('click').on('click', function() {
          if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
            alert('jsPDF not loaded');
            return;
          }

          const jsPDF = window.jspdf.jsPDF;
          const doc = new jsPDF();
          doc.setFontSize(16);
          const title = 'Cover Letter – ' + ($('#jobDesc').val().substring(0, 50) + (response.cover_letter.length > 50 ? '...' : ''));
          doc.text(title, 20, 20);

          doc.setFontSize(12);
          const lines = doc.splitTextToSize(response.cover_letter, 170);
          doc.text(lines, 20, 40);

          doc.save('Cover_Letter_ResumeForge.pdf');
        });
      } else {
        alert('No cover letter returned from server');
      }
    },
    error: function() {
      $('#coverLoading').hide();
      $('#generateCoverBtn').prop('disabled', false);
      alert('Error generating cover letter. Check console for details.');
    }
  });
});

// LinkedIn Optimizer
$('#optimizeLinkedinBtn').on('click', function() {
  $('#linkedinLoading').show();
  $('#optimizeLinkedinBtn').prop('disabled', true);

  const formData = new FormData();
  formData.append('headline', $('#linkedinHeadline').val().trim());
  formData.append('about', $('#linkedinAbout').val().trim());
  formData.append('experience', $('#linkedinExperience').val().trim());
  formData.append('skills', $('#linkedinSkills').val().trim());
  if (linkedinFile) formData.append('linkedinFile', linkedinFile);
  formData.append('jobDesc', $('#jobDesc').val() || ''); // Reuse if available


  $.ajax({
    url: '/api/optimize-linkedin',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      $('#linkedinLoading').hide();
      $('#optimizeLinkedinBtn').prop('disabled', false);

      if (response.optimized_profile) {
        $('#linkedinResult').html(`
          <h5 class="text-success mb-3">🔗 LinkedIn Profile Optimization Report</h5>
          <div class="mb-3"><strong>Score:</strong> ${response.score || 'N/A'}/100</div>
          <div class="mb-3"><strong>Suggested Headline:</strong><p class="bg-dark p-3 rounded">${response.headline || 'N/A'}</p></div>
          <div class="mb-3"><strong>Rewritten About:</strong><p class="bg-dark p-3 rounded">${response.about || 'N/A'}</p></div>
          <div><strong>Suggested Skills:</strong><ul>${(response.skills || []).map(s => `<li>${s}</li>`).join('')}</ul></div>
          <div class="alert alert-info mt-4"><strong>Tips:</strong><br>${(response.tips || []).join('<br>')}</div>
        `).fadeIn();

        // Copy all
        $('#copyLinkedinBtn').off('click').on('click', function() {
          const allText = `Headline: ${response.headline || ''}\n\nAbout:\n${response.about || ''}\n\nSkills:\n${response.skills?.join(', ') || ''}`;
          navigator.clipboard.writeText(allText).then(() => {
            $(this).text('Copied!').delay(2000).queue(() => $(this).text('Copy All Suggestions'));
          });
        });
      } else {
        alert('No suggestions returned');
      }
    },
    error: function() {
      $('#linkedinLoading').hide();
      $('#optimizeLinkedinBtn').prop('disabled', false);
      alert('Error optimizing LinkedIn profile');
    }
  });
});

// Generate full optimized resume
$('#generateFullResumeBtn').on('click', function() {
  // Reuse the latest AI response (you need to store it globally or in a variable)
  // For simplicity, we'll assume you saved the last successful response as window.lastResumeOptimization
  // You can set this in the existing success handler of optimizeForm

  if (!window.lastResumeOptimization) {
    alert('Please run optimization first');
    return;
  }

  $('#fullResumeSection').fadeIn();

  // Build clean resume text (you can customize formatting)
  const opt = window.lastResumeOptimization;
  let resumeContent = `
${opt.name || 'Your Name'}
${opt.title || 'Full Stack Developer | Remote'}
${opt.location || 'Lagos, Nigeria | Open to Remote'}

Professional Summary
${opt.rewritten_summary || 'Professional summary not available'}

Experience
${opt.rewritten_experience?.map(bullet => `• ${bullet}`).join('\n') || 'No experience bullets available'}

Skills
${opt.missing_keywords?.concat(opt.skills || []).join(', ') || 'Skills not available'}

Additional Tips Applied:
- ATS-friendly keywords added
- Quantified achievements emphasized
- Action verbs used
  `.trim();

  $('#fullResumePreview').text(resumeContent);

  // Download PDF
  $('#downloadResumePdfBtn').off('click').on('click', function() {
    if (!window.jspdf?.jsPDF) {
      alert('jsPDF not loaded');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4'
    });

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(resumeContent, 500);
    doc.text(splitText, 40, 40);
    doc.save('Optimized_Resume.pdf');
  });

  // Download DOCX (simple text-based – for real DOCX use a library like docx.js)
  $('#downloadResumeDocBtn').off('click').on('click', function() {
    const blob = new Blob([resumeContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Optimized_Resume.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});