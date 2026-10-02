import html
from docutils import nodes

def card_help_role(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """
    Custom Sphinx role for info help tooltips.
    Defaults to inline rendering. Use wrapper div for top-right placement.
    """
    escaped_text = html.escape(text)
    
    svg_html = (
        f'<span class="card-help" data-tooltip="{escaped_text}" tabindex="0" role="button" aria-label="Help Information">'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24" '
        f'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" '
        f'class="sd-text-info">'
        f'<circle cx="12" cy="12" r="10"></circle>'
        f'<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>'
        f'<line x1="12" y1="17" x2="12.01" y2="17"></line>'
        f'</svg></span>'
    )
    
    node = nodes.raw('', svg_html, format='html')
    return [node], []


def setup(app):
    app.add_role('card-help', card_help_role)
    return {
        'version': '1.3',
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }