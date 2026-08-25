# Memory photos

Drop the real photos in this folder. Nothing else needs changing —
`src/components/Memories/memories.js` picks up every image here
automatically and the placeholder set switches off on its own.

Accepted: .jpg .jpeg .png .webp

Filename order controls the order they're drawn in, so prefix them:

    01-cafeteria-chairs.jpg
    02-team-five.jpg
    03-street-selfie.jpg
    04-street-two.jpg
    05-cafeteria-two.jpg

Portrait and landscape are both fine — each print sizes itself to the
photo's own aspect ratio, so nothing gets cropped.

To caption a photo, add its filename to `CAPTIONS` in
`src/components/Memories/memories.js`.
