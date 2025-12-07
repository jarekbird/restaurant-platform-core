/**
 * JsonLd component
 * Renders JSON-LD structured data as a script tag
 */

interface JsonLdProps {
  data: object;
}

/**
 * JsonLd component
 * Renders structured data as JSON-LD script tag for SEO
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

