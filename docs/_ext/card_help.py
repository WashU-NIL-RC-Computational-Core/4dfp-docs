import html
from docutils import nodes
from sphinx.addnodes import pending_xref

def card_help_role(name, rawtext, text, lineno, inliner, options={}, content=[]):
    """
    Custom Sphinx role for info help tooltips.
    - Usage 1 (Glossary Link Preview): :card-help:`term:DICOM.studies.txt`
    - Usage 2 (Custom CSS Tooltip): :card-help:`Hover text goes here`
    """
    svg_icon = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24" '
        'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" '
        'class="sd-text-info">'
        '<circle cx="12" cy="12" r="10"></circle>'
        '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>'
        '<line x1="12" y1="17" x2="12.01" y2="17"></line>'
        '</svg>'
    )

    if text.startswith('term:'):
        term_name = text[5:].strip()
        
        svg_html = f'<span class="card-help" aria-label="Help Information">{svg_icon}</span>'
        raw_node = nodes.raw('', svg_html, format='html')

        ref_node = pending_xref(
            rawtext,
            reftype='term',
            reftarget=term_name.lower(),
            refdomain='std',
            refexplicit=True,
            refwarn=True
        )
        ref_node += raw_node
        return [ref_node], []

    escaped_text = html.escape(text)
    svg_html = (
        f'<span class="card-help" data-tooltip="{escaped_text}" tabindex="0" role="button" aria-label="Help Information">'
        f'{svg_icon}</span>'
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