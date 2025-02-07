import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Rename Campaign', () => {
	const camp = 'renameCampaignGraphQL';
	const renamedCamp = 'renameCampaignGraphQL_updated';

	it('Rename a campaign using GraphQL', () => {
		cy.uploadCampaign(camp, 'gt.redeye');
		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			cy.returnToCampaignCard();
			cy.wait(1000);

			const mutation = `mutation renameCampaign($campaignId: String!, $name: String!) {
				renameCampaign(campaignId: $campaignId, name: $name) {
				  id
				}
			  }
			  `;

			const variables = { campaignId: returnedUrl, name: renamedCamp };

			mutRequest(mutation, variables);

			const query = `query campaigns {
				campaigns {
					  id
					  name
					}
				  }`;

			graphqlRequest(query).then((res) => {
				const campNames = res.body.data.campaigns.map((ty) => ty.name);
				expect(campNames).to.include(renamedCamp);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(renamedCamp);
	});
});
