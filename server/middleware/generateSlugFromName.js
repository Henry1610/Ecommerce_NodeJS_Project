import slugify from 'slugify';

export function generateSlugFromName(req, res, next) {
  const name = req.body.name || 'default-name';
  req.slug = slugify(name, { lower: true, strict: true });
  next();
}
