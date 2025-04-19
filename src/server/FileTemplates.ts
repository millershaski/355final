

export function Get404PageString(): any 
{
    return `<html>
        <head>
            <title>404 Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #212529;}
                h1 { font-size: 48px; color: #ff4c4c; }
                p { font-size: 18px; color: #FFFFFF; }
                a { text-decoration: none; color: #007bff; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>404 Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <p>Try checking the URL or go back to the <a href="/">homepage</a>.</p>
        </body>
    </html>
    `;
}
