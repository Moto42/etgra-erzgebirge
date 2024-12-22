/** file for extending the Decap CMS */
/**Registers a compnent for the markdown editor that adds a banner to the markdown */
CMS.registerEditorComponent({
    id: 'widget_banner',
    label: 'Banner Image',
    fields: [
        {
            label: 'Heading Level',
            name: 'headinglevel',
            widget: 'select',
            options: [
                // {
                //     label: 'H1',
                //     value: 'h1'
                // },
                {
                    label: 'H2',
                    value: 'h2'
                },
                {
                    label: 'H3',
                    value: 'h3'
                },
                {
                    label: 'H4',
                    value: 'h4'
                },
                {
                    label: 'H5',
                    value: 'h5'
                },
                {
                    label: 'H6',
                    value: 'h6'
                }
            ]
        },
        {
            label: 'Headline',
            name: 'headline',
            widget: 'string'
        },
        {
            label: 'Image',
            name: 'image',
            widget: 'image',
            allow_multiple: false,
            choose_url: false,
        }
    ],
    pattern: /{% widgets-banner (.*?) (.*?) %}/m,
    fromBlock: function(match) {
        return {
            headline: match[1],
            image: match[2]
        };
    },
    toBlock: function(obj) {
        return `{% widgets-Banner "${obj.headinglevel}" "${obj.headline}" "${obj.image}" %}`;
    },
    toPreview: function(obj) {
        return `<div class="banner-preview"><h1>${obj.headline}</h1><img src="${obj.image}" alt="${obj.headline}" /></div>`;
    }
});