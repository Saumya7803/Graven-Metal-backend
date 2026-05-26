import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'GRAVEN METAL' },
    supportEmail: { type: String, default: 'info@gravenmetal.com' },
    maintenanceMode: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: 'GRAVEN METAL' },
      metaDescription: { type: String, default: 'Premium dark luxury metal trading platform.' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
