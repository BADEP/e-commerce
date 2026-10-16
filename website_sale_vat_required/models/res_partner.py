# Copyright 2015 Agile Business Group sagl (<http://www.agilebg.com>)
# Copyright 2017 Jairo Llopis <jairo.llopis@tecnativa.com>
# Copyright 2025 Carlos Lopez - Tecnativa
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from odoo import models


class ResPartner(models.Model):
    _inherit = "res.partner"

    def _get_mandatory_billing_address_fields(self, country_sudo, **kwargs):
        field_names = super()._get_mandatory_billing_address_fields(
            country_sudo, **kwargs
        )
        if "vat" not in field_names:
            field_names |= {"vat"}
        return field_names
