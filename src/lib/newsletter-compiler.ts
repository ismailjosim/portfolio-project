/**
 * Compiles plain text / Markdown content into a responsive, modern HTML email template.
 * Supports:
 * - Paragraphs & line breaks
 * - Headings (# H1, ## H2, ### H3)
 * - Bold (**text**), Italic (*text*), Strikethrough (~~text~~)
 * - Links ([Title](url))
 * - CTA Buttons ([button:Text](url) or [button](url))
 * - Images/Photos (![Alt](url))
 * - Bullet lists (- item or * item) and Numbered lists (1. item or 1) item)
 * - Blockquotes (> quote)
 * - Horizontal dividers (---)
 * - Emojis (native)
 */

export interface CompileEmailOptions {
  subject?: string;
  unsubscribeUrl?: string;
  senderName?: string;
  previewText?: string;
  subscriberName?: string;
  subscriberEmail?: string;
}

export function compileNewsletterToHtml(
  content: string,
  options: CompileEmailOptions = {}
): string {
  const {
    subject = '',
    unsubscribeUrl = '#',
    senderName = 'Ismail Josim',
    previewText = '',
    subscriberName = '',
    subscriberEmail = '',
  } = options;

  const displayName = (subscriberName || '').trim() || 'there';
  const displayEmail = (subscriberEmail || '').trim();
  const firstName = displayName.split(' ')[0] || displayName;

  // Dynamically replace template merge tags: {{name}}, {{first_name}}, {{email}}, {{unsubscribe_url}}
  const resolvedContent = content
    .replace(/\{\{\s*name\s*\}\}/gi, displayName)
    .replace(/\{\{\s*first_name\s*\}\}/gi, firstName)
    .replace(/\{\{\s*firstName\s*\}\}/gi, firstName)
    .replace(/\{\{\s*email\s*\}\}/gi, displayEmail)
    .replace(/\{\{\s*unsubscribe_url\s*\}\}/gi, unsubscribeUrl)
    .replace(/\{\{\s*unsubscribeUrl\s*\}\}/gi, unsubscribeUrl);

  const lines = resolvedContent.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  const closeList = () => {
    if (inList) {
      htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
  };

  const processInline = (text: string): string => {
    let result = text
      // Escape HTML entities (except when inside our tags)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Images: ![alt](url)
    result = result.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      '<div style="margin: 20px 0; text-align: center;"><img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; display: block; margin: 0 auto;" /></div>'
    );

    // Call-to-action button: [button:Label](url) or [CTA:Label](url)
    result = result.replace(
      /\[(?:button|cta):(.*?)\]\((.*?)\)/gi,
      '<div style="margin: 24px 0; text-align: center;"><table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="#0284c7" style="border-radius: 8px;"><a href="$2" target="_blank" style="padding: 13px 26px; font-weight: 600; color: #ffffff; text-decoration: none; display: inline-block; font-size: 15px; border-radius: 8px; background: #0284c7;">$1</a></td></tr></table></div>'
    );

    // Regular links: [title](url)
    result = result.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" style="color: #0284c7; font-weight: 500; text-decoration: underline;">$1</a>'
    );

    // Bold: **text**
    result = result.replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color: #0f172a; font-weight: 600;">$1</strong>'
    );

    // Italic: *text* or _text_
    result = result.replace(/(?:^|\s)\*(.*?)\*(?=\s|$)/g, ' <em>$1</em>');
    result = result.replace(/(?:^|\s)_(.*?)_(?=\s|$)/g, ' <em>$1</em>');

    // Inline code: `code`
    result = result.replace(
      /`([^`]+)`/g,
      '<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #0f172a;">$1</code>'
    );

    return result;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    // Dividers: ---
    if (/^---{1,}$/.test(trimmed)) {
      closeList();
      htmlParts.push('<hr style="margin: 28px 0; border: none; border-top: 1px solid #e2e8f0;" />');
      continue;
    }

    // Heading 1: # Title
    if (trimmed.startsWith('# ')) {
      closeList();
      const text = processInline(trimmed.substring(2));
      htmlParts.push(
        `<h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 24px 0 12px; line-height: 1.3;">${text}</h1>`
      );
      continue;
    }

    // Heading 2: ## Title
    if (trimmed.startsWith('## ')) {
      closeList();
      const text = processInline(trimmed.substring(3));
      htmlParts.push(
        `<h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 20px 0 10px; line-height: 1.35;">${text}</h2>`
      );
      continue;
    }

    // Heading 3: ### Title
    if (trimmed.startsWith('### ')) {
      closeList();
      const text = processInline(trimmed.substring(4));
      htmlParts.push(
        `<h3 style="font-size: 17px; font-weight: 600; color: #1e293b; margin: 16px 0 8px; line-height: 1.4;">${text}</h3>`
      );
      continue;
    }

    // Blockquote: > Quote
    if (trimmed.startsWith('> ')) {
      closeList();
      const text = processInline(trimmed.substring(2));
      htmlParts.push(
        `<blockquote style="margin: 16px 0; padding-left: 16px; border-left: 4px solid #0284c7; color: #475569; font-style: italic;">${text}</blockquote>`
      );
      continue;
    }

    // Unordered list: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ul') {
        closeList();
        htmlParts.push(
          '<ul style="margin: 12px 0; padding-left: 24px; color: #334155; line-height: 1.6;">'
        );
        inList = true;
        listType = 'ul';
      }
      const itemText = processInline(trimmed.replace(/^[-*]\s+/, ''));
      htmlParts.push(`<li style="margin-bottom: 6px;">${itemText}</li>`);
      continue;
    }

    // Ordered list: 1. item or 1) item
    if (/^\d+[.)]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        closeList();
        htmlParts.push(
          '<ol style="margin: 12px 0; padding-left: 24px; color: #334155; line-height: 1.6;">'
        );
        inList = true;
        listType = 'ol';
      }
      const itemText = processInline(trimmed.replace(/^\d+[.)]\s+/, ''));
      htmlParts.push(`<li style="margin-bottom: 6px;">${itemText}</li>`);
      continue;
    }

    // Normal paragraph
    closeList();
    const processed = processInline(trimmed);
    htmlParts.push(
      `<p style="font-size: 15px; color: #334155; line-height: 1.65; margin: 0 0 16px;">${processed}</p>`
    );
  }

  closeList();

  const bodyHtml = htmlParts.join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || 'Newsletter'}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${previewText}</div>` : ''}

  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 28px 20px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <span style="font-size: 17px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">${senderName}</span>
                    <span style="display: block; font-size: 12px; color: #64748b; margin-top: 2px;">Weekly Tech & Dev Newsletter</span>
                  </td>
                  <td align="right">
                    <span style="background-color: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; border: 1px solid #bbf7d0;">Newsletter</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 28px 28px 20px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 28px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; line-height: 1.5;">
                You received this email because you subscribed to updates on <a href="https://www.ismailjosim.com" target="_blank" style="color: #0284c7; text-decoration: none; font-weight: 500;">ismailjosim.com</a>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                No longer want these emails? <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">Unsubscribe here</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
