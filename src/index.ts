import joplin from 'api';

joplin.plugins.register({
  onStart: async function() {
    // Register the theme
    await joplin.themes.registerCss('monkeytype-theme', `
      :root {
        --accent-primary: #ffc600;
      }
    `);

    // Create settings panel for accent color
    await joplin.settings.registerSection('monkeytypeSection', {
      label: 'MonkeyType Theme',
      iconName: 'fas fa-palette',
      description: 'Customize your MonkeyType theme appearance'
    });

    await joplin.settings.registerSettings({
      'accentColor': {
        value: '#ffc600',
        type: 'string',
        section: 'monkeytypeSection',
        public: true,
        label: 'Accent Color',
        description: 'Choose the primary accent color for the theme'
      },
      'enableAnimations': {
        value: true,
        type: 'bool',
        section: 'monkeytypeSection',
        public: true,
        label: 'Enable Animations',
        description: 'Smooth cursor animations and transitions'
      }
    });

    // Watch for settings changes and update CSS variables
    await joplin.settings.onChange(async (event: any) => {
      if (event.keys.includes('accentColor')) {
        const accentColor = await joplin.settings.value('accentColor');
        await updateAccentColor(accentColor);
      }
    });

    async function updateAccentColor(color: string) {
      // Update CSS variables dynamically
      const style = document.createElement('style');
      style.id = 'monkeytype-dynamic-styles';
      style.textContent = `
        :root {
          --accent-primary: ${color};
          --accent-primary-dim: ${color}80;
        }
        
        .note-editor textarea::selection {
          background-color: ${color}30;
        }
        
        .note-editor textarea::-moz-selection {
          background-color: ${color}30;
        }
      `;
      
      // Remove existing dynamic styles
      const existingStyle = document.getElementById('monkeytype-dynamic-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      document.head.appendChild(style);
    }

    // Initialize with current settings
    const initialColor = await joplin.settings.value('accentColor');
    await updateAccentColor(initialColor);

    console.log('MonkeyType Dark Theme started with accent color:', initialColor);
  },
});